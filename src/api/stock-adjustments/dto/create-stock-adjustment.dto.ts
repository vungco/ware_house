import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsUUID,
  IsEnum,
  IsNumber,
  Min,
  IsOptional,
  IsString,
} from 'class-validator';
import { AdjustmentType } from '../entities/stock-adjustment.entity';

export class CreateStockAdjustmentDto {
  @ApiProperty({
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    description: 'ID kho',
  })
  @IsUUID()
  warehouse_id: string;

  @ApiProperty({
    example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    description: 'ID vật tư',
  })
  @IsUUID()
  material_id: string;

  @ApiProperty({
    enum: AdjustmentType,
    example: AdjustmentType.INCREASE,
    description: 'Loại điều chỉnh tồn kho (tăng hoặc giảm)',
  })
  @IsEnum(AdjustmentType)
  type: AdjustmentType;

  @ApiProperty({
    example: 10,
    description: 'Số lượng điều chỉnh (phải > 0)',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0.001)
  quantity: number;

  @ApiPropertyOptional({
    example: 'Điều chỉnh do kiểm kê cuối kỳ',
    description: 'Lý do điều chỉnh tồn kho',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
