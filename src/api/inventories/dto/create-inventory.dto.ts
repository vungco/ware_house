import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateInventoryDto {
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

  @ApiPropertyOptional({
    example: 100,
    description: 'Số lượng tồn kho hiện tại',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Số lượng tồn tối thiểu để cảnh báo',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  min_quantity?: number;
}
