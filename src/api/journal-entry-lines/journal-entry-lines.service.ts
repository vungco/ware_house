import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntryLine } from './entities/journal-entry-line.entity';
import { CreateJournalEntryLineDto } from './dto/create-journal-entry-line.dto';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class JournalEntryLinesService {
  constructor(
    @InjectRepository(JournalEntryLine)
    private repo: Repository<JournalEntryLine>,

    private accountsService: AccountsService,
  ) {}

  async create(
    dto: CreateJournalEntryLineDto,
    journalEntryId: string,
  ) {
    // check account tồn tại
    await this.accountsService.findOne(dto.account_id);

    // rule kế toán cơ bản
    if (dto.debit > 0 && dto.credit > 0) {
      throw new BadRequestException(
        'Một dòng không được có cả debit và credit',
      );
    }

    if (dto.debit === 0 && dto.credit === 0) {
      throw new BadRequestException(
        'Phải có debit hoặc credit',
      );
    }

    const line = this.repo.create({
      ...dto,
      journal_entry_id: journalEntryId,
    });

    return this.repo.save(line);
  }

  findByEntry(entryId: string) {
    return this.repo.find({
      where: { journal_entry_id: entryId },
      relations: ['account'],
    });
  }

  async remove(id: string) {
    const line = await this.repo.findOne({ where: { id } });
    if (!line) throw new NotFoundException('Line not found');

    return this.repo.remove(line);
  }
}
