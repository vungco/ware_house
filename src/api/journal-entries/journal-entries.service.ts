import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntry } from './entities/journal-entry.entity';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../audit-logs/entities/audit-log.entity';

@Injectable()
export class JournalEntriesService {
    constructor(
        @InjectRepository(JournalEntry)
        private readonly repo: Repository<JournalEntry>,
        private readonly auditLogsService: AuditLogsService,
    ) {}

    async create(dto: CreateJournalEntryDto, userId: string) {
        const totalDebit = dto.lines.reduce((s, l) => s + l.debit, 0);
        const totalCredit = dto.lines.reduce((s, l) => s + l.credit, 0);

        if (totalDebit !== totalCredit) {
            throw new BadRequestException('Debit phải bằng Credit');
        }

        const entry = this.repo.create({
            code: dto.code,
            date: dto.date,
            description: dto.description,
            createdBy: { id: userId },
        });

        const saved = await this.repo.save(entry);

        await this.auditLogsService.create({
            userId,
            action: AuditAction.CREATE,
            entityName: 'JournalEntry',
            entityId: saved.id,
            newValue: saved,
        });

        return saved;
    }

    findAll() {
        return this.repo.find({
            relations: ['lines', 'lines.account'],
            order: { date: 'DESC' },
        });
    }

    async findOne(id: string) {
        const entry = await this.repo.findOne({
            where: { id },
            relations: ['lines', 'lines.account'],
        });

        if (!entry) throw new NotFoundException();
        return entry;
    }

    async remove(id: string, userId: string) {
        const entry = await this.findOne(id);
        await this.repo.softRemove(entry);

        await this.auditLogsService.create({
            userId,
            action: AuditAction.DELETE,
            entityName: 'JournalEntry',
            entityId: id,
            oldValue: entry,
        });

        return { message: 'Deleted' };
    }
}
