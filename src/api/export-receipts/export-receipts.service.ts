import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ExportReceipt } from './entities/export-receipt.entity';
import { ExportReceiptItem } from './entities/export-receipt-item.entity';
import { CreateExportReceiptDto } from './dto/create-export-receipt.dto';
import { User } from '../users/entities/user.entity';
import { ReceiptStatus } from '../import-receipts/entities/import-receipt.entity';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../audit-logs/entities/audit-log.entity';
import { Inventory } from '../inventories/entities/inventory.entity';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class ExportReceiptsService {
    constructor(
        private readonly dataSource: DataSource,

        @InjectRepository(ExportReceipt)
        private readonly receiptRepo: Repository<ExportReceipt>,

        @InjectRepository(ExportReceiptItem)
        private readonly itemRepo: Repository<ExportReceiptItem>,

        private readonly auditLogsService: AuditLogsService,
        private readonly accountsService: AccountsService,
    ) {}

    // ================= CREATE =================
    async create(dto: CreateExportReceiptDto, user: User) {
        return this.dataSource.transaction(async (manager) => {
            const receipt = manager.create(ExportReceipt, {
                code: `ER-${Date.now()}`,
                warehouse_id: dto.warehouse_id,
                created_by: user.id,
                reason: dto.reason ?? null,
                status: ReceiptStatus.DRAFT,
            });

            await manager.save(receipt);

            for (const item of dto.items) {
                const receiptItem = manager.create(ExportReceiptItem, {
                    receipt_id: receipt.id,
                    material_id: item.material_id,
                    quantity: item.quantity,
                    price: item.price,
                });

                await manager.save(receiptItem);
            }

            await this.auditLogsService.create({
                userId: user.id,
                action: AuditAction.CREATE,
                entityName: 'ExportReceipt',
                entityId: receipt.id,
                newValue: dto,
            });

            return receipt;
        });
    }

    // ================= FIND ALL =================
    async findAll() {
        return this.receiptRepo.find({
            relations: ['warehouse', 'creator', 'items', 'items.material'],
            order: { created_at: 'DESC' },
        });
    }

    // ================= FIND ONE =================
    async findOne(id: string) {
        const receipt = await this.receiptRepo.findOne({
            where: { id },
            relations: ['warehouse', 'creator', 'items', 'items.material'],
        });

        if (!receipt) {
            throw new NotFoundException('Export receipt not found');
        }

        return receipt;
    }

    // ================= CANCEL =================
    async cancel(id: string, user: User) {
        const receipt = await this.receiptRepo.findOne({ where: { id } });

        if (!receipt) {
            throw new NotFoundException('Export receipt not found');
        }

        if (receipt.status === ReceiptStatus.CANCELED) {
            throw new BadRequestException('Receipt already canceled');
        }

        if (receipt.status === ReceiptStatus.COMPLETED) {
            throw new BadRequestException('Completed receipt cannot be canceled');
        }

        receipt.status = ReceiptStatus.CANCELED;
        await this.receiptRepo.save(receipt);

        await this.auditLogsService.create({
            userId: user.id,
            action: AuditAction.CANCEL,
            entityName: 'ExportReceipt',
            entityId: receipt.id,
            oldValue: { status: ReceiptStatus.DRAFT },
            newValue: { status: ReceiptStatus.CANCELED },
        });

        return receipt;
    }

    // ================= COMPLETE =================
    async complete(id: string, user: User) {
        return this.dataSource.transaction(async (manager) => {
            const receipt = await manager.findOne(ExportReceipt, {
                where: { id },
                relations: ['items'],
            });

            if (!receipt) throw new NotFoundException('Export receipt not found');
            if (receipt.status !== ReceiptStatus.DRAFT) {
                throw new BadRequestException('Only DRAFT receipt can be completed');
            }

            let totalCost = 0;

            // 1️⃣ Check tồn kho + tính giá vốn
            for (const item of receipt.items) {
                const inventory = await manager.findOne(Inventory, {
                    where: {
                        warehouse_id: receipt.warehouse_id,
                        material_id: item.material_id,
                    },
                });

                if (!inventory || inventory.quantity < item.quantity) {
                    throw new BadRequestException(
                        `Not enough stock for material ${item.material_id}`,
                    );
                }

                const exportQty = Number(item.quantity);
                totalCost += exportQty * Number(inventory.avg_price);
            }

            // 2️⃣ Trừ kho + total_value
            for (const item of receipt.items) {
                const inventory = await manager.findOneByOrFail(Inventory, {
                    warehouse_id: receipt.warehouse_id,
                    material_id: item.material_id,
                });

                const exportQty = Number(item.quantity);
                const exportValue = exportQty * Number(inventory.avg_price);

                inventory.quantity -= exportQty;
                inventory.total_value -= exportValue;

                // tránh số âm do làm tròn
                if (inventory.quantity === 0) {
                    inventory.total_value = 0;
                }

                await manager.save(inventory);
            }

            // 3️⃣ Update trạng thái phiếu
            receipt.status = ReceiptStatus.COMPLETED;
            await manager.save(receipt);

            // 4️⃣ Hạch toán kế toán (GIÁ VỐN)
            await this.accountsService.createExportEntry(manager, receipt, user.id,totalCost);

            // 5️⃣ Audit log
            await this.auditLogsService.create({
                userId: user.id,
                action: AuditAction.UPDATE,
                entityName: 'ExportReceipt',
                entityId: receipt.id,
                oldValue: { status: ReceiptStatus.DRAFT },
                newValue: { status: ReceiptStatus.COMPLETED },
            });

            return receipt;
        });
    }
}
