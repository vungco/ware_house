import { AccountCategory } from 'src/api/accounts/entities/account.entity';

export interface AccountingLineIntent {
    category: AccountCategory;
    amount: number;
    side: 'DEBIT' | 'CREDIT';
}
export interface AccountingIntent {
    code: string;
    date: Date;
    description: string;
    createdBy: string;
    lines: AccountingLineIntent[];
}
