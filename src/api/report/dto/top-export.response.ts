import { ApiProperty } from '@nestjs/swagger';

export class TopExportMaterialResponse {
  @ApiProperty({ example: 'Cáp quang' })
  materialName: string;

  @ApiProperty({ example: 700 })
  exportQuantity: number;
}
