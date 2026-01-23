import { Module } from '@nestjs/common';
import { ExportReceiptsService } from './export-receipts.service';
import { ExportReceiptsController } from './export-receipts.controller';

@Module({
  controllers: [ExportReceiptsController],
  providers: [ExportReceiptsService],
})
export class ExportReceiptsModule {}
