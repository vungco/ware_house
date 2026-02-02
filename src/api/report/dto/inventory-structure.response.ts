import { ApiProperty } from '@nestjs/swagger';

export class InventoryStructureItemResponse {
  @ApiProperty({ example: 'Cáp quang' })
  materialName: string;

  @ApiProperty({ example: 800 })
  quantity: number;

  @ApiProperty({ example: 95.24 })
  percentage: number;
}

export class InventoryStructureResponse {
  @ApiProperty({ example: 840 })
  totalQuantity: number;

  @ApiProperty({ type: [InventoryStructureItemResponse] })
  items: InventoryStructureItemResponse[];
}
