import { Test, TestingModule } from '@nestjs/testing';
import { JournalEntryLinesController } from './journal-entry-lines.controller';
import { JournalEntryLinesService } from './journal-entry-lines.service';

describe('JournalEntryLinesController', () => {
  let controller: JournalEntryLinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JournalEntryLinesController],
      providers: [JournalEntryLinesService],
    }).compile();

    controller = module.get<JournalEntryLinesController>(JournalEntryLinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
