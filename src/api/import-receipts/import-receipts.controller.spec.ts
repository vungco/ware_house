import { Test, TestingModule } from '@nestjs/testing';
import { ImportReceiptsController } from './import-receipts.controller';
import { ImportReceiptsService } from './import-receipts.service';

describe('ImportReceiptsController', () => {
  let controller: ImportReceiptsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportReceiptsController],
      providers: [ImportReceiptsService],
    }).compile();

    controller = module.get<ImportReceiptsController>(ImportReceiptsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
