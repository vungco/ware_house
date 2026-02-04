import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntry } from './entities/journal-entry.entity';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';

@Injectable()
export class JournalEntriesService {
    constructor(
        @InjectRepository(JournalEntry)
        private readonly repo: Repository<JournalEntry>,
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

        return this.repo.save(entry);
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

    async remove(id: string) {
        const entry = await this.findOne(id);
        await this.repo.softRemove(entry);
        return { message: 'Deleted' };
    }
}
