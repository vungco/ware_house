import { Test, TestingModule } from '@nestjs/testing';
import { ExportReceiptsService } from './export-receipts.service';

describe('ExportReceiptsService', () => {
  let service: ExportReceiptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExportReceiptsService],
    }).compile();

    service = module.get<ExportReceiptsService>(ExportReceiptsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
