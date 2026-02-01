import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdjustmentType, StockAdjustment } from "./entities/stock-adjustment.entity";
import { DataSource, Repository } from "typeorm";
import { Inventory } from "../inventories/entities/inventory.entity";
import { AuditLogsService } from "../audit-logs/audit-logs.service";
import { CreateStockAdjustmentDto } from "./dto/create-stock-adjustment.dto";
import { User } from "../users/entities/user.entity";
import { AuditAction } from "../audit-logs/entities/audit-log.entity";
import { FindStockAdjustmentDto } from "./dto/find-stock.dto";

@Injectable()
export class StockAdjustmentsService {
  constructor(
    @InjectRepository(StockAdjustment)
    private readonly adjustmentRepo: Repository<StockAdjustment>,

    private readonly dataSource: DataSource,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  // ================= CREATE =================
  async create(dto: CreateStockAdjustmentDto, user: User) {
    return this.dataSource.transaction(async (manager) => {
      const inventory = await manager.findOne(Inventory, {
        where: {
          warehouse_id: dto.warehouse_id,
          material_id: dto.material_id,
        },
      });

      if (!inventory) {
        throw new BadRequestException('Inventory record not found');
      }

      // ❌ Check trừ kho
      if (
        dto.type === AdjustmentType.DECREASE &&
        inventory.quantity < dto.quantity
      ) {
        throw new BadRequestException('Not enough stock to decrease');
      }

      // ✅ Update tồn kho
      if (dto.type === AdjustmentType.INCREASE) {
        inventory.quantity += dto.quantity;
      } else {
        inventory.quantity -= dto.quantity;
      }

      await manager.save(inventory);

      // ✅ Lưu adjustment
      const adjustment = manager.create(StockAdjustment, {
        warehouse_id: dto.warehouse_id,
        material_id: dto.material_id,
        type: dto.type,
        quantity: dto.quantity,
        reason: dto.reason,
        created_by: user.id,
      });

      await manager.save(adjustment);

      await this.auditLogsService.create({
        userId: user.id,
        action: AuditAction.CREATE,
        entityName: 'StockAdjustment',
        entityId: adjustment.id,
        newValue: dto,
      });

      return adjustment;
    });
  }

  // ================= LIST =================
  async findAll(query: FindStockAdjustmentDto) {
    return this.adjustmentRepo.find({
      where: {
        ...(query.warehouse_id && { warehouse_id: query.warehouse_id }),
        ...(query.material_id && { material_id: query.material_id }),
      },
      order: { created_at: 'DESC' },
    });
  }
}
