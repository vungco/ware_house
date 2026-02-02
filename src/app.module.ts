import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './cache/redis.module';
import { RolesModule } from './api/roles/roles.module';
import { UsersModule } from './api/users/users.module';
import { WarehousesModule } from './api/warehouses/warehouses.module';
import { SuppliersModule } from './api/suppliers/suppliers.module';
import { MaterialsModule } from './api/materials/materials.module';
import { InventoriesModule } from './api/inventories/inventories.module';
import { ImportReceiptsModule } from './api/import-receipts/import-receipts.module';
import { ExportReceiptsModule } from './api/export-receipts/export-receipts.module';
import { StockAdjustmentsModule } from './api/stock-adjustments/stock-adjustments.module';
import { AuditLogsModule } from './api/audit-logs/audit-logs.module';
import { AuthModule } from './api/auth/auth.module';
import { ReportModule } from './api/report/report.module';

@Module({
    imports: [
        DatabaseModule,
        RedisModule,
        RolesModule,
        UsersModule,
        WarehousesModule,
        SuppliersModule,
        MaterialsModule,
        InventoriesModule,
        ImportReceiptsModule,
        ExportReceiptsModule,
        StockAdjustmentsModule,
        AuditLogsModule,
        UsersModule,
        RolesModule,
        AuthModule,
        ReportModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
