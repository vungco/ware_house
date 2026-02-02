import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class FindStockAdjustmentDto {
  @ApiPropertyOptional({
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    description: 'Lọc theo ID kho',
  })
  @IsOptional()
  @IsUUID()
  warehouse_id?: string;

  @ApiPropertyOptional({
    example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    description: 'Lọc theo ID vật tư',
  })
  @IsOptional()
  @IsUUID()
  material_id?: string;
}
