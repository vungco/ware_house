import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stocktake, StocktakeStatus } from './entities/stocktake.entity';
import { DataSource, Repository } from 'typeorm';
import { Inventory } from '../inventories/entities/inventory.entity';
import { CreateStocktakeDto } from './dto/create-stocktake.dto';
import { UpdateStocktakeDto } from './dto/update-stocktake.dto';
import { StocktakeQueryDto } from './dto/query-stocktake.dto';
import { StockAdjustmentsService } from '../stock-adjustments/stock-adjustments.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../audit-logs/entities/audit-log.entity';
import { User } from '../users/entities/user.entity';
import { AdjustmentType } from '../stock-adjustments/entities/stock-adjustment.entity';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class StocktakesService {
    constructor(
        @InjectRepository(Stocktake)
        private readonly stocktakeRepo: Repository<Stocktake>,

        @InjectRepository(Inventory)
        private readonly inventoryRepo: Repository<Inventory>,

        private readonly dataSource: DataSource,
        private readonly stockAdjustmentsService: StockAdjustmentsService,
        private readonly auditLogsService: AuditLogsService,
        private readonly accountsService: AccountsService,
    ) {}

    // CREATE
    async create(dto: CreateStocktakeDto, user: User) {
        const inventories = await this.inventoryRepo.find({
            where: { warehouse_id: dto.warehouse_id },
        });

        const map = new Map(inventories.map((i) => [i.material_id, i]));

        const entity = this.stocktakeRepo.create({
            warehouse_id: dto.warehouse_id,
            note: dto.note,
            items: dto.items.map((i) => {
                const inv = map.get(i.material_id);
                const systemQty = inv?.quantity ?? 0;

                return {
                    material_id: i.material_id,
                    inventory_id: inv?.id,
                    system_quantity: systemQty,
                    actual_quantity: i.actual_quantity,
                    difference: i.actual_quantity - systemQty,
                };
            }),
        });

        const saved = await this.stocktakeRepo.save(entity);

        await this.auditLogsService.create({
            userId: user.id,
            action: AuditAction.CREATE,
            entityName: 'Stocktake',
            entityId: saved.id,
            newValue: dto,
        });

        return saved;
    }

    findAll() {
        return this.stocktakeRepo.find({
            relations: ['warehouse', 'items', 'items.material'],
            order: { created_at: 'DESC' },
        });
    }

    findOne(id: string) {
        return this.stocktakeRepo.findOne({
            where: { id },
            relations: ['warehouse', 'items', 'items.material'],
        });
    }

    async update(id: string, dto: UpdateStocktakeDto, user: User) {
        const stocktake = await this.stocktakeRepo.findOne({ where: { id } });

        if (!stocktake) {
            throw new NotFoundException('Stocktake not found');
        }

        if (stocktake.status !== StocktakeStatus.DRAFT) {
            throw new BadRequestException('Only DRAFT stocktake can be updated');
        }

        await this.stocktakeRepo.update(id, dto);

        await this.auditLogsService.create({
            userId: user.id,
            action: AuditAction.UPDATE,
            entityName: 'Stocktake',
            entityId: id,
            newValue: dto,
        });

        return this.findOne(id);
    }

    async remove(id: string, user: User) {
        await this.stocktakeRepo.delete(id);

        await this.auditLogsService.create({
            userId: user.id,
            action: AuditAction.DELETE,
            entityName: 'Stocktake',
            entityId: id,
        });

        return { message: 'Deleted' };
    }

    async search(query: StocktakeQueryDto) {
        return this.stocktakeRepo.find({
            where: {
                ...(query.warehouse_id && { warehouse_id: query.warehouse_id }),
            },
            relations: ['warehouse', 'items', 'items.material'],
            order: { created_at: 'DESC' },
        });
    }

    async approve(id: string, user: User) {
        return this.dataSource.transaction(async (manager) => {
            const stocktake = await manager.findOne(Stocktake, {
                where: { id },
                relations: ['items'],
            });

            if (!stocktake) {
                throw new BadRequestException('Stocktake not found');
            }

            if (stocktake.status !== StocktakeStatus.DRAFT) {
                throw new BadRequestException('Only DRAFT can approve');
            }

            for (const item of stocktake.items) {
                if (item.difference === 0) continue;

                await this.stockAdjustmentsService.create(
                    {
                        warehouse_id: stocktake.warehouse_id,
                        material_id: item.material_id,
                        type:
                            item.difference > 0 ? AdjustmentType.INCREASE : AdjustmentType.DECREASE,
                        quantity: Math.abs(item.difference),
                        reason: 'Stocktake adjustment',
                    },
                    user,
                );
            }

            stocktake.status = StocktakeStatus.APPROVED;
            await manager.save(stocktake);

            await this.accountsService.createStocktakeAdjustmentEntry(manager, stocktake, user.id);

            await this.auditLogsService.create({
                userId: user.id,
                action: AuditAction.UPDATE,
                entityName: 'Stocktake',
                entityId: stocktake.id,
                newValue: { status: 'APPROVED' },
            });

            return stocktake;
        });
    }

    async cancel(id: string, user: User) {
        const stocktake = await this.stocktakeRepo.findOne({
            where: { id },
        });

        if (!stocktake) {
            throw new BadRequestException('Stocktake not found');
        }

        if (stocktake.status !== StocktakeStatus.DRAFT) {
            throw new BadRequestException('Only DRAFT can cancel');
        }

        stocktake.status = StocktakeStatus.CANCELLED;
        await this.stocktakeRepo.save(stocktake);

        await this.auditLogsService.create({
            userId: user.id,
            action: AuditAction.UPDATE,
            entityName: 'Stocktake',
            entityId: stocktake.id,
            newValue: { status: 'CANCELLED' },
        });

        return stocktake;
    }
}
