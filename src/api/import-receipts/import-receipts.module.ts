import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportReceipt } from './entities/import-receipt.entity';
import { ImportReceiptItem } from './entities/import-receipt-item.entity';
import { ImportReceiptsService } from './import-receipts.service';
import { ImportReceiptsController } from './import-receipts.controller';
import { Inventory } from '../inventories/entities/inventory.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ImportReceipt,
      ImportReceiptItem,
      Inventory,
    ]),
    AuditLogsModule,
    AccountsModule
  ],
  controllers: [ImportReceiptsController],
  providers: [ImportReceiptsService],
})
export class ImportReceiptsModule {}
