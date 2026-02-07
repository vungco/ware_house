import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class StocktakeQueryDto {
  @ApiPropertyOptional()
  @IsUUID()
  warehouse_id?: string;
}
