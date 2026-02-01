import { AdjustmentType } from "../entities/stock-adjustment.entity";

export class CreateStockAdjustmentDto {
  warehouse_id: string;
  material_id: string;
  type: AdjustmentType; // INCREASE | DECREASE
  quantity: number;
  reason?: string;
}
