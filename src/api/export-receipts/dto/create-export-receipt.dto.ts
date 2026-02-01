import { Type } from 'class-transformer';
import { IsUUID, IsString, IsOptional,IsNumber, Min, ValidateNested } from 'class-validator';

export class CreateExportReceiptDto {
  @IsUUID()
  warehouse_id: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateExportReceiptItemDto)
  items: CreateExportReceiptItemDto[];
}

export class CreateExportReceiptItemDto {
  @IsUUID()
  material_id: string;

  @IsNumber()
  @Min(0.001)
  quantity: number;
}
