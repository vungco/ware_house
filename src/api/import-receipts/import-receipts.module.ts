import { Module } from '@nestjs/common';
import { ImportReceiptsService } from './import-receipts.service';
import { ImportReceiptsController } from './import-receipts.controller';

@Module({
  controllers: [ImportReceiptsController],
  providers: [ImportReceiptsService],
})
export class ImportReceiptsModule {}
