import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockAdjustmentsService } from './stock-adjustments.service';
import { StockAdjustment } from './entities/stock-adjustment.entity';
import { Inventory } from '../inventories/entities/inventory.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { StockAdjustmentsController } from './stock-adjustments.controller';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockAdjustment, Inventory]),
    AuditLogsModule,
    AccountsModule
  ],
  controllers: [StockAdjustmentsController],
  providers: [StockAdjustmentsService],
  exports: [StockAdjustmentsService],
})
export class StockAdjustmentsModule {}
