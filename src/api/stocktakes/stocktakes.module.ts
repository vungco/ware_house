import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StocktakesService } from './stocktakes.service';
import { StocktakesController } from './stocktakes.controller';
import { Stocktake } from './entities/stocktake.entity';
import { Inventory } from '../inventories/entities/inventory.entity';
import { StockAdjustmentsModule } from '../stock-adjustments/stock-adjustments.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { StocktakeItem } from './entities/stock-item.entity';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Stocktake,
      StocktakeItem,
      Inventory,
    ]),
    AuditLogsModule,
    StockAdjustmentsModule,
    AccountsModule
  ],
  controllers: [StocktakesController],
  providers: [StocktakesService],
  exports: [StocktakesService],
})
export class StocktakesModule {}
