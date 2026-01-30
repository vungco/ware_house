import { Module } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { WarehousesController } from './warehouses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { Warehouse } from './entities/warehouse.entity';
import { Inventory } from '../inventories/entities/inventory.entity';
import { Material } from '../materials/entities/material.entity';
import { ImportReceiptItem } from '../import-receipts/entities/import-receipt-item.entity';
import { ImportReceipt } from '../import-receipts/entities/import-receipt.entity';
import { ExportReceipt } from '../export-receipts/entities/export-receipt.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { ExportReceiptItem } from '../export-receipts/entities/export-receipt-item.entity';
import { StockAdjustment } from '../stock-adjustments/entities/stock-adjustment.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Warehouse,
            Inventory,
            Material,
            ImportReceipt,
            ExportReceipt,
            Supplier,
            ImportReceiptItem,
            ExportReceiptItem,
            StockAdjustment,
        ]),
        AuditLogsModule,
    ],
    controllers: [WarehousesController],
    providers: [WarehousesService],
})
export class WarehousesModule {}
