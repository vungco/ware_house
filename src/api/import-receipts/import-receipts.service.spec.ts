import { Test, TestingModule } from '@nestjs/testing';
import { ImportReceiptsService } from './import-receipts.service';

describe('ImportReceiptsService', () => {
  let service: ImportReceiptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportReceiptsService],
    }).compile();

    service = module.get<ImportReceiptsService>(ImportReceiptsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
