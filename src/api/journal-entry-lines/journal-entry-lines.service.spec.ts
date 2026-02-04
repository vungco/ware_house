import { Test, TestingModule } from '@nestjs/testing';
import { JournalEntryLinesService } from './journal-entry-lines.service';

describe('JournalEntryLinesService', () => {
  let service: JournalEntryLinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JournalEntryLinesService],
    }).compile();

    service = module.get<JournalEntryLinesService>(JournalEntryLinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
