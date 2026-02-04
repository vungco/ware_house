import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

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

    @ApiPropertyOptional({ example: '2025-01-01' })
    @IsOptional()
    fromDate?: string;

    @ApiPropertyOptional({ example: '2025-01-31' })
    @IsOptional()
    toDate?: string;

    @ApiProperty({ type: [InventorySummaryItemResponse] })
    items: InventorySummaryItemResponse[];
}
