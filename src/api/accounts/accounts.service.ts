import {
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Account, AccountStatus, AccountType } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ImportReceipt } from '../import-receipts/entities/import-receipt.entity';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AccountingEntryService } from './AccountingService';
import { ExportReceipt } from '../export-receipts/entities/export-receipt.entity';
import {
    AdjustmentType,
    StockAdjustment,
} from '../stock-adjustments/entities/stock-adjustment.entity';
import { AuditAction } from '../audit-logs/entities/audit-log.entity';
import { Stocktake } from '../stocktakes/entities/stocktake.entity';
import { Inventory } from '../inventories/entities/inventory.entity';

@Injectable()
export class AccountsService implements OnModuleInit {
    private readonly logger = new Logger(AccountsService.name);

    constructor(
        @InjectRepository(Account)
        private readonly accountRepo: Repository<Account>,
        private readonly dataSource: DataSource,
        private readonly auditLogsService: AuditLogsService,
        private readonly accountingEntryService: AccountingEntryService,
    ) {}

    onModuleInit() {
        this.seedAccounts(this.dataSource);
    }

    async seedAccounts(dataSource: DataSource) {
        const repo = dataSource.getRepository(Account);

        const accounts = [
            { code: '111', name: 'Tiền mặt', type: AccountType.ASSET },
            { code: '112', name: 'Tiền gửi ngân hàng', type: AccountType.ASSET },
            { code: '131', name: 'Phải thu khách hàng', type: AccountType.ASSET },
            { code: '152', name: 'Hàng tồn kho', type: AccountType.ASSET },
            { code: '331', name: 'Phải trả nhà cung cấp', type: AccountType.LIABILITY },
            { code: '511', name: 'Doanh thu bán hàng', type: AccountType.REVENUE },
            { code: '632', name: 'Giá vốn hàng bán', type: AccountType.EXPENSE },
            { code: '711', name: 'Thu nhập khác', type: AccountType.REVENUE },
            { code: '811', name: 'Chi phí khác', type: AccountType.EXPENSE },
        ];

        for (const acc of accounts) {
            const exists = await repo.findOne({ where: { code: acc.code } });

            if (!exists) {
                await repo.save(
                    repo.create({
                        ...acc,
                        status: AccountStatus.ACTIVE,
                    }),
                );
            }
        }
    }

    async create(dto: CreateAccountDto, userId: string) {
        const exists = await this.accountRepo.findOne({
            where: { code: dto.code },
        });

        if (exists) throw new ConflictException('Account code already exists');

        const account = await this.accountRepo.save(this.accountRepo.create(dto));

        await this.auditLogsService.create({
            userId,
            action: AuditAction.CREATE,
            entityName: 'Account',
            entityId: account.id,
            newValue: account,
        });

        return account;
    }

    findAll() {
        return this.accountRepo.find({
            order: { code: 'ASC' },
        });
    }

    async findOne(id: string) {
        const account = await this.accountRepo.findOne({
            where: { id },
        });

        if (!account) throw new NotFoundException('Account not found');
        return account;
    }

    async update(id: string, dto: UpdateAccountDto, userId: string) {
        const account = await this.findOne(id);

        const oldValue = { ...account };

        if (dto.code && dto.code !== account.code) {
            const exists = await this.accountRepo.findOne({
                where: { code: dto.code },
            });

            if (exists) throw new ConflictException('Account code already exists');
        }

        Object.assign(account, dto);
        const saved = await this.accountRepo.save(account);

        await this.auditLogsService.create({
            userId,
            action: AuditAction.UPDATE,
            entityName: 'Account',
            entityId: saved.id,
            oldValue,
            newValue: saved,
        });

        return saved;
    }

    async remove(id: string, userId: string) {
        const account = await this.findOne(id);

        await this.accountRepo.softRemove(account);

        await this.auditLogsService.create({
            userId,
            action: AuditAction.DELETE,
            entityName: 'Account',
            entityId: id,
            oldValue: account,
        });

        return { message: 'Deleted successfully' };
    }

    async createImportEntry(
        manager: EntityManager,
        receipt: ImportReceipt,
        userId: string,
    ) {
        const totalAmount = receipt.items.reduce(
            (sum, item) => sum + Number(item.price) * Number(item.quantity),
            0,
        );

        const entry = await this.accountingEntryService.postEntry(manager, {
            code: `JE-IMPORT-${receipt.code}`,
            description: `Nhập kho từ phiếu ${receipt.code}`,
            createdBy: userId,
            lines: [
                { accountCode: '152', debit: totalAmount },
                { accountCode: '331', credit: totalAmount },
            ],
        });

        await this.auditLogsService.create({
            userId,
            action: AuditAction.IMPORT,
            entityName: 'ImportReceipt',
            entityId: receipt.id,
            newValue: entry,
        });

        return entry;
    }

    async createExportEntry(
        manager: EntityManager,
        receipt: ExportReceipt,
        userId: string,
        totalCost: number,
    ) {
        const totalRevenue = receipt.items.reduce(
            (sum, item) => sum + Number(item.price) * Number(item.quantity),
            0,
        );

        const entry = await this.accountingEntryService.postEntry(manager, {
            code: `JE-EXPORT-${receipt.code}`,
            description: `Xuất bán từ phiếu ${receipt.code}`,
            createdBy: userId,
            lines: [
                { accountCode: '131', debit: totalRevenue },
                { accountCode: '511', credit: totalRevenue },
                { accountCode: '632', debit: totalCost },
                { accountCode: '152', credit: totalCost },
            ],
        });

        await this.auditLogsService.create({
            userId,
            action: AuditAction.EXPORT,
            entityName: 'ExportReceipt',
            entityId: receipt.id,
            newValue: entry,
        });

        return entry;
    }

    async createStockAdjustmentEntry(
        manager: EntityManager,
        adjustment: StockAdjustment,
        amount: number,
        userId: string,
    ) {
        const isIncrease = adjustment.type === AdjustmentType.INCREASE;

        const entry = await this.accountingEntryService.postEntry(manager, {
            code: `JE-ADJ-${adjustment.id}`,
            description: `Điều chỉnh tồn kho (${adjustment.type})`,
            createdBy: userId,
            lines: isIncrease
                ? [
                      { accountCode: '152', debit: amount },
                      { accountCode: '711', credit: amount },
                  ]
                : [
                      { accountCode: '811', debit: amount },
                      { accountCode: '152', credit: amount },
                  ],
        });

        await this.auditLogsService.create({
            userId,
            action: AuditAction.STOCK_ADJUST,
            entityName: 'StockAdjustment',
            entityId: adjustment.id,
            newValue: entry,
        });

        return entry;
    }

    async createStocktakeAdjustmentEntry(
    manager: EntityManager,
    stocktake: Stocktake,
    userId: string,
) {
    let totalIncrease = 0; // thừa kho
    let totalDecrease = 0; // thiếu kho

    for (const item of stocktake.items) {
        if (item.difference === 0) continue;

        const inventory = await manager.findOne(Inventory, {
            where: {
                warehouse_id: stocktake.warehouse_id,
                material_id: item.material_id,
            },
        });

        if (!inventory) continue;

        const avgPrice = Number(inventory.avg_price);
        const value = Math.abs(Number(item.difference)) * avgPrice;

        if (item.difference > 0) {
            totalIncrease += value;
        } else {
            totalDecrease += value;
        }
    }

    const lines : any = [];

    // thiếu kho
    if (totalDecrease > 0) {
        lines.push({ accountCode: '811', debit: totalDecrease });
        lines.push({ accountCode: '152', credit: totalDecrease });
    }

    // thừa kho
    if (totalIncrease > 0) {
        lines.push({ accountCode: '152', debit: totalIncrease });
        lines.push({ accountCode: '711', credit: totalIncrease });
    }

    if (!lines.length) return null;

    return this.accountingEntryService.postEntry(manager, {
        code: `JE-STOCKTAKE-${stocktake.id}`,
        description: `Điều chỉnh kiểm kê ${stocktake.id}`,
        createdBy: userId,
        lines,
    });
}

}
