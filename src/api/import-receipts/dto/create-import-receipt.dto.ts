import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsUUID,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class ImportItemDto {
  @ApiProperty()
  @IsUUID()
  material_id: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.001)
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateImportReceiptDto {
  @ApiProperty()
  @IsUUID()
  warehouse_id: string;

  @ApiProperty()
  @IsUUID()
  supplier_id: string;

  @ApiProperty({ type: [ImportItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportItemDto)
  items: ImportItemDto[];
}
