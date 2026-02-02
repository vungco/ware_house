import { ApiProperty } from '@nestjs/swagger';

export class InventorySummaryItemResponse {
  @ApiProperty({ example: 'VT001' })
  materialCode: string;

  @ApiProperty({ example: 'Cáp quang' })
  materialName: string;

  @ApiProperty({ example: 'm' })
  unit: string;

  @ApiProperty({ example: 1000 })
  openingStock: number;

  @ApiProperty({ example: 500 })
  importQuantity: number;

  @ApiProperty({ example: 700 })
  exportQuantity: number;

  @ApiProperty({ example: 800 })
  closingStock: number;
}

export class InventorySummaryResponse {
  @ApiProperty({ example: 'Kho trung tâm' })
  warehouseName: string;

  @ApiProperty({ example: '2024-01-01' })
  fromDate: string;

  @ApiProperty({ example: '2024-01-31' })
  toDate: string;

  @ApiProperty({ type: [InventorySummaryItemResponse] })
  items: InventorySummaryItemResponse[];
}
