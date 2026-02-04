import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdjustmentType, StockAdjustment } from './entities/stock-adjustment.entity';
import { DataSource, Repository } from 'typeorm';
import { Inventory } from '../inventories/entities/inventory.entity';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateStockAdjustmentDto } from './dto/create-stock-adjustment.dto';
import { User } from '../users/entities/user.entity';
import { AuditAction } from '../audit-logs/entities/audit-log.entity';
import { FindStockAdjustmentDto } from './dto/find-stock.dto';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class StockAdjustmentsService {
    constructor(
        @InjectRepository(StockAdjustment)
        private readonly adjustmentRepo: Repository<StockAdjustment>,

        private readonly dataSource: DataSource,
        private readonly auditLogsService: AuditLogsService,
        private readonly accountsService: AccountsService,
    ) {}

    // ================= CREATE =================
    async create(dto: CreateStockAdjustmentDto, user: User) {
        return this.dataSource.transaction(async (manager) => {
            const inventory = await manager.findOne(Inventory, {
                where: {
                    warehouse_id: dto.warehouse_id,
                    material_id: dto.material_id,
                },
            });

            if (!inventory) {
                throw new BadRequestException('Inventory record not found');
            }

            if (dto.type === AdjustmentType.DECREASE && inventory.quantity < dto.quantity) {
                throw new BadRequestException('Not enough stock to decrease');
            }

            const qty = Number(dto.quantity);
            const amount = qty * Number(inventory.avg_price);

            // 1️⃣ Update tồn kho (CẢ quantity & value)
            if (dto.type === AdjustmentType.INCREASE) {
                inventory.quantity += qty;
                inventory.total_value += amount;
            } else {
                inventory.quantity -= qty;
                inventory.total_value -= amount;

                if (inventory.quantity === 0) {
                    inventory.total_value = 0;
                }
            }

            await manager.save(inventory);

            // 2️⃣ Lưu adjustment
            const adjustment = manager.create(StockAdjustment, {
                warehouse_id: dto.warehouse_id,
                material_id: dto.material_id,
                type: dto.type,
                quantity: qty,
                reason: dto.reason,
                created_by: user.id,
            });

            await manager.save(adjustment);

            // 3️⃣ HẠCH TOÁN KẾ TOÁN
            await this.accountsService.createStockAdjustmentEntry(
                manager,
                adjustment,
                amount,
                user.id,
            );

            // 4️⃣ Audit
            await this.auditLogsService.create({
                userId: user.id,
                action: AuditAction.CREATE,
                entityName: 'StockAdjustment',
                entityId: adjustment.id,
                newValue: dto,
            });

            return adjustment;
        });
    }

    // ================= LIST =================
    async findAll(query: FindStockAdjustmentDto) {
        return this.adjustmentRepo.find({
            where: {
                ...(query.warehouse_id && { warehouse_id: query.warehouse_id }),
                ...(query.material_id && { material_id: query.material_id }),
            },
            order: { created_at: 'DESC' },
        });
    }
}
