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
            // ===== TÀI SẢN =====
            { code: '111', name: 'Tiền mặt', type: AccountType.ASSET },
            { code: '112', name: 'Tiền gửi ngân hàng', type: AccountType.ASSET },
            { code: '131', name: 'Phải thu khách hàng', type: AccountType.ASSET },
            { code: '152', name: 'Hàng tồn kho', type: AccountType.ASSET },

            // ===== NỢ PHẢI TRẢ =====
            { code: '331', name: 'Phải trả nhà cung cấp', type: AccountType.LIABILITY },

            // ===== DOANH THU =====
            { code: '511', name: 'Doanh thu bán hàng', type: AccountType.REVENUE },

            // ===== CHI PHÍ =====
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
                this.logger.log(`Seeded account ${acc.code} - ${acc.name}`);
            }
        }

        this.logger.log('Account seeding completed');
    }

    // CREATE
    async create(dto: CreateAccountDto) {
        const exists = await this.accountRepo.findOne({
            where: { code: dto.code },
        });

        if (exists) throw new ConflictException('Account code already exists');

        const account = this.accountRepo.create(dto);

        return this.accountRepo.save(account);
    }

    // READ ALL
    findAll() {
        return this.accountRepo.find({
            order: { code: 'ASC' },
        });
    }

    // READ ONE
    async findOne(id: string) {
        const account = await this.accountRepo.findOne({
            where: { id },
        });

        if (!account) throw new NotFoundException('Account not found');
        return account;
    }

    // UPDATE
    async update(id: string, dto: UpdateAccountDto) {
        const account = await this.findOne(id);

        if (dto.code && dto.code !== account.code) {
            const exists = await this.accountRepo.findOne({
                where: { code: dto.code },
            });

            if (exists) throw new ConflictException('Account code already exists');
        }

        Object.assign(account, dto);
        return this.accountRepo.save(account);
    }

    // DELETE (soft delete nếu BaseEntity có deleted_at)
    async remove(id: string) {
        const account = await this.findOne(id);
        await this.accountRepo.softRemove(account);
        return { message: 'Deleted successfully' };
    }

    async createImportEntry(manager: EntityManager, receipt: ImportReceipt, userId: string) {
        const totalAmount = receipt.items.reduce(
            (sum, item) => sum + Number(item.price) * Number(item.quantity),
            0,
        );

        if (totalAmount <= 0) {
            throw new Error('Total amount must be greater than 0');
        }

        return this.accountingEntryService.postEntry(manager, {
            code: `JE-IMPORT-${receipt.code}`,
            description: `Nhập kho từ phiếu ${receipt.code}`,
            createdBy: userId,
            lines: [
                {
                    accountCode: '152',
                    debit: totalAmount,
                },
                {
                    accountCode: '331',
                    credit: totalAmount,
                },
            ],
        });
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

        if (totalRevenue <= 0) {
            throw new Error('Total revenue must be greater than 0');
        }

        return this.accountingEntryService.postEntry(manager, {
            code: `JE-EXPORT-${receipt.code}`,
            description: `Xuất bán từ phiếu ${receipt.code}`,
            createdBy: userId,
            lines: [
                // ===== DOANH THU =====
                {
                    accountCode: '131', // Phải thu KH (hoặc 111/112)
                    debit: totalRevenue,
                },
                {
                    accountCode: '511', // Doanh thu
                    credit: totalRevenue,
                },

                // ===== GIÁ VỐN =====
                {
                    accountCode: '632',
                    debit: totalCost,
                },
                {
                    accountCode: '152',
                    credit: totalCost,
                },
            ],
        });
    }

    async createStockAdjustmentEntry(
        manager: EntityManager,
        adjustment: StockAdjustment,
        amount: number,
        userId: string,
    ) {
        if (amount <= 0) {
            throw new Error('Amount must be greater than 0');
        }

        const isIncrease = adjustment.type === AdjustmentType.INCREASE;

        return this.accountingEntryService.postEntry(manager, {
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
    }
}
