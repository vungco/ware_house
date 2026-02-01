import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockAdjustmentsService } from './stock-adjustments.service';
import { StockAdjustment } from './entities/stock-adjustment.entity';
import { Inventory } from '../inventories/entities/inventory.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { StockAdjustmentsController } from './stock-adjustments.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockAdjustment, Inventory]),
    AuditLogsModule,
  ],
  controllers: [StockAdjustmentsController],
  providers: [StockAdjustmentsService],
})
export class StockAdjustmentsModule {}
