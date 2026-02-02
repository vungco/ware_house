import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional } from 'class-validator';

export class UpdateInventoryDto {
  @ApiPropertyOptional({
    example: 150,
    description: 'Cập nhật số lượng tồn kho hiện tại',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({
    example: 20,
    description: 'Cập nhật số lượng tồn tối thiểu để cảnh báo',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  min_quantity?: number;
}
