import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class TopExportQuery {
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

    @ApiPropertyOptional({ example: 5, description: 'Số vật tư top' })
    @IsOptional()
    @IsNumber()
    limit?: number = 5;
}
