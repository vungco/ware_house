import { Test, TestingModule } from '@nestjs/testing';
import { ExportReceiptsController } from './export-receipts.controller';
import { ExportReceiptsService } from './export-receipts.service';

describe('ExportReceiptsController', () => {
  let controller: ExportReceiptsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportReceiptsController],
      providers: [ExportReceiptsService],
    }).compile();

    controller = module.get<ExportReceiptsController>(ExportReceiptsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
