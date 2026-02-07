import { Module } from '@nestjs/common';
import { JournalEntriesService } from './journal-entries.service';
import { JournalEntriesController } from './journal-entries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalEntry } from './entities/journal-entry.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([JournalEntry]), AuditLogsModule],
  controllers: [JournalEntriesController],
  providers: [JournalEntriesService],
})
export class JournalEntriesModule {}
