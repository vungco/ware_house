import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { JournalEntryLine } from '../../journal-entry-lines/entities/journal-entry-line.entity';

export enum AccountType {
    ASSET = 'ASSET',
    LIABILITY = 'LIABILITY',
    EXPENSE = 'EXPENSE',
    REVENUE = 'REVENUE',
    EQUITY = 'EQUITY',
}

export enum AccountStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export enum AccountCategory {
    CASH = 'CASH',
    BANK = 'BANK',
    INVENTORY = 'INVENTORY',
    PAYABLE = 'PAYABLE',
    RECEIVABLE = 'RECEIVABLE',
    COST = 'COST',
    OTHER = 'OTHER',
}

@Entity('accounts')
export class Account extends BaseEntity {
    @Index({ unique: true })
    @Column({ length: 20 })
    code: string;

    @Column({ length: 120 })
    name: string;

    @Column({
        type: 'enum',
        enum: AccountType,
    })
    type: AccountType;

    @Column({
        type: 'enum',
        enum: AccountStatus,
        default: AccountStatus.ACTIVE,
    })
    status: AccountStatus;

    @Column({
        type: 'enum',
        enum: AccountCategory,
        nullable: true,
    })
    category?: AccountCategory;

    // relation kế toán sau này
    @OneToMany(() => JournalEntryLine, (line) => line.account)
    journal_lines: JournalEntryLine[];
}
