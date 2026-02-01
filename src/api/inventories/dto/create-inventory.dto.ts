import { IsUUID, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateInventoryDto {
  @IsUUID()
  warehouse_id: string;

  @IsUUID()
  material_id: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  min_quantity?: number;
}
