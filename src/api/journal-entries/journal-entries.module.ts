import { Module } from '@nestjs/common';
import { JournalEntriesService } from './journal-entries.service';
import { JournalEntriesController } from './journal-entries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalEntry } from './entities/journal-entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JournalEntry])],
  controllers: [JournalEntriesController],
  providers: [JournalEntriesService],
})
export class JournalEntriesModule {}
