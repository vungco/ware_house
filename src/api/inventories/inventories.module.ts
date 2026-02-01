import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Inventory } from "./entities/inventory.entity";
import { InventoriesController } from "./inventories.controller";
import { InventoriesService } from "./inventories.service";
import { AuditLogsModule } from "../audit-logs/audit-logs.module";

@Module({
  imports: [TypeOrmModule.forFeature([Inventory]), AuditLogsModule],
  controllers: [InventoriesController],
  providers: [InventoriesService],
})
export class InventoriesModule {}
