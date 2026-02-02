import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class TopExportQuery {
    @ApiProperty({
        example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    })
    @IsUUID()
    warehouseId: string;

    @ApiProperty({ example: '2024-01-01' })
    @IsDateString()
    fromDate: string;

    @ApiProperty({ example: '2024-01-31' })
    @IsDateString()
    toDate: string;

    @ApiPropertyOptional({ example: 5, description: 'Số vật tư top' })
    @IsOptional()
    @IsNumber()
    limit?: number = 5;
}
