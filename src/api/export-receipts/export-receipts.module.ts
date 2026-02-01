import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportReceipt } from './entities/export-receipt.entity';
import { ExportReceiptItem } from './entities/export-receipt-item.entity';
import { Inventory } from '../inventories/entities/inventory.entity';
import { ExportReceiptsService } from './export-receipts.service';
import { ExportReceiptsController } from './export-receipts.controller';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExportReceipt,
      ExportReceiptItem,
      Inventory,
    ]),
    AuditLogsModule,
  ],
  controllers: [ExportReceiptsController],
  providers: [ExportReceiptsService],
})
export class ExportReceiptsModule {}
