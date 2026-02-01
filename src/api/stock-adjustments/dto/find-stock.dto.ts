import { IsOptional, IsUUID } from 'class-validator';

export class FindStockAdjustmentDto {
  @IsOptional()
  @IsUUID()
  warehouse_id?: string;

  @IsOptional()
  @IsUUID()
  material_id?: string;
}
