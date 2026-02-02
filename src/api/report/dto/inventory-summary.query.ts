import { IsUUID, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InventorySummaryQuery {
    @ApiProperty({
        example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    })
    @IsUUID()
    warehouseId: string;

    @ApiProperty({ example: '2025-01-01' })
    @IsDateString()
    fromDate: string;

    @ApiProperty({ example: '2025-01-31' })
    @IsDateString()
    toDate: string;
}
