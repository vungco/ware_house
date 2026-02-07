import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStocktakeItemDto {
  @ApiProperty({
    example: 'fa3a4f6f-1209-4460-bde0-0f636d03b62b',
  })
  @IsUUID()
  material_id: string;

  @ApiProperty({
    example: 120,
    description: 'Số lượng kiểm kê thực tế',
  })
  @IsNumber()
  actual_quantity: number;
}

export class CreateStocktakeDto {
  @ApiProperty({
    example: 'ed2c34c5-a701-4132-83db-b0086f100049',
    description: 'Warehouse ID',
  })
  @IsUUID()
  warehouse_id: string;

  @ApiProperty({
    example: 'Kiểm kê cuối tháng',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    type: [CreateStocktakeItemDto],
    example: [
      {
        material_id: 'fa3a4f6f-1209-4460-bde0-0f636d03b62b',
        actual_quantity: 120,
      },
      {
        material_id: '8b3c6c1e-7a2b-4c23-8b61-9f5b3f6b4b19',
        actual_quantity: 55,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStocktakeItemDto)
  items: CreateStocktakeItemDto[];
}


