import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ImportReceipt, ReceiptStatus } from './entities/import-receipt.entity';
import { ImportReceiptItem } from './entities/import-receipt-item.entity';
import { CreateImportReceiptDto } from './dto/create-import-receipt.dto';
import { Inventory } from '../inventories/entities/inventory.entity';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { User } from '../users/entities/user.entity';
import { AuditAction } from '../audit-logs/entities/audit-log.entity';

@Injectable()
export class ImportReceiptsService {
    constructor(
        private readonly dataSource: DataSource,

        @InjectRepository(ImportReceipt)
        private readonly receiptRepo: Repository<ImportReceipt>,

        @InjectRepository(ImportReceiptItem)
        private readonly itemRepo: Repository<ImportReceiptItem>,

        @InjectRepository(Inventory)
        private readonly inventoryRepo: Repository<Inventory>,

        private readonly auditLogsService: AuditLogsService,
    ) {}

    // ================= CREATE =================
    async create(dto: CreateImportReceiptDto, user: User) {
        return this.dataSource.transaction(async (manager) => {
            const receipt = manager.create(ImportReceipt, {
                code: `IR-${Date.now()}`,
                warehouse_id: dto.warehouse_id,
                supplier_id: dto.supplier_id,
                created_by: user.id,
                status: ReceiptStatus.DRAFT,
            });

            await manager.save(receipt);

            for (const item of dto.items) {
                const receiptItem = manager.create(ImportReceiptItem, {
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
                entityName: 'ImportReceipt',
                entityId: receipt.id,
                newValue: dto,
            });

            return receipt;
        });
    }

    // ================= COMPLETE =================
    async complete(id: string, user: User) {
        return this.dataSource.transaction(async (manager) => {
            const receipt = await manager.findOne(ImportReceipt, {
                where: { id },
                relations: ['items'],
            });

            if (!receipt) throw new NotFoundException('Receipt not found');
            if (receipt.status !== ReceiptStatus.DRAFT) {
                throw new BadRequestException('Receipt cannot be completed');
            }

            // Update inventory
            for (const item of receipt.items) {
                let inventory = await manager.findOne(Inventory, {
                    where: {
                        warehouse_id: receipt.warehouse_id,
                        material_id: item.material_id,
                    },
                });

                if (!inventory) {
                    inventory = manager.create(Inventory, {
                        warehouse_id: receipt.warehouse_id,
                        material_id: item.material_id,
                        quantity: item.quantity,
                    });
                } else {
                    inventory.quantity += item.quantity;
                }

                await manager.save(inventory);
            }

            receipt.status = ReceiptStatus.COMPLETED;
            await manager.save(receipt);

            await this.auditLogsService.create({
                userId: user.id,
                action: AuditAction.UPDATE,
                entityName: 'ImportReceipt',
                entityId: receipt.id,
                oldValue: { status: ReceiptStatus.DRAFT },
                newValue: { status: ReceiptStatus.COMPLETED },
            });

            return receipt;
        });
    }

    findAll() {
        return this.receiptRepo.find({
            relations: ['warehouse', 'supplier', 'items'],
            order: { created_at: 'DESC' },
        });
    }

    findOne(id: string) {
        return this.receiptRepo.findOne({
            where: { id },
            relations: ['warehouse', 'supplier', 'items'],
        });
    }

    async cancel(id: string, user: User) {
        const receipt = await this.receiptRepo.findOne({
            where: { id },
        });

        if (!receipt) {
            throw new NotFoundException('Import receipt not found');
        }

        if (receipt.status === ReceiptStatus.CANCELED) {
            throw new BadRequestException('Receipt already canceled');
        }

        if (receipt.status === ReceiptStatus.COMPLETED) {
            throw new BadRequestException(
                'Completed receipt cannot be canceled. Use stock adjustment instead.',
            );
        }

        const oldStatus = receipt.status;

        receipt.status = ReceiptStatus.CANCELED;

        const savedReceipt = await this.receiptRepo.save(receipt);

        // ===== LOG =====
        await this.auditLogsService.create({
            userId: user.id,
            action: AuditAction.CANCEL,
            entityName: 'ImportReceipt',
            entityId: receipt.id,
            oldValue: {
                status: oldStatus,
            },
            newValue: {
                status: ReceiptStatus.CANCELED,
            },
        });

        return savedReceipt;
    }
}
