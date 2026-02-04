import { IsUUID, IsOptional } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class InventorySummaryQuery {
  @ApiProperty({
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
  })
  @IsUUID()
  warehouseId: string;

  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsOptional()
  fromDate?: string;

  @ApiPropertyOptional({ example: '2025-01-31' })
  @IsOptional()
  toDate?: string;
}
