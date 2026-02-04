import { Injectable } from "@nestjs/common";
import { EntityManager, In } from "typeorm";
import { Account, AccountStatus } from "./entities/account.entity";
import { JournalEntry, JournalEntryStatus } from "../journal-entries/entities/journal-entry.entity";
import { JournalEntryLine } from "../journal-entry-lines/entities/journal-entry-line.entity";

// accounting-entry.service.ts
@Injectable()
export class AccountingEntryService {
    async postEntry(
        manager: EntityManager,
        payload: {
            code: string;
            description: string;
            createdBy: string;
            lines: {
                accountCode: string;
                debit?: number;
                credit?: number;
            }[];
        },
    ) {
        const accountRepo = manager.getRepository(Account);
        const entryRepo = manager.getRepository(JournalEntry);
        const lineRepo = manager.getRepository(JournalEntryLine);

        // 1. Load accounts
        const accounts = await accountRepo.find({
            where: {
                code: In(payload.lines.map(l => l.accountCode)),
                status: AccountStatus.ACTIVE,
            },
        });

        if (accounts.length !== payload.lines.length) {
            throw new Error('Missing or inactive accounting account');
        }

        // 2. Check debit = credit
        const totalDebit = payload.lines.reduce((s, l) => s + (l.debit || 0), 0);
        const totalCredit = payload.lines.reduce((s, l) => s + (l.credit || 0), 0);

        if (totalDebit !== totalCredit) {
            throw new Error('Debit and Credit are not balanced');
        }

        // 3. Create JournalEntry
        const entry = entryRepo.create({
            code: payload.code,
            date: new Date(),
            description: payload.description,
            status: JournalEntryStatus.POSTED,
            createdBy: { id: payload.createdBy },
        });

        await entryRepo.save(entry);

        // 4. Create lines
        const lines = payload.lines.map(l =>
            lineRepo.create({
                journalEntry: entry,
                account: accounts.find(a => a.code === l.accountCode),
                debit: l.debit || 0,
                credit: l.credit || 0,
            }),
        );

        await lineRepo.save(lines);

        return entry;
    }
}
