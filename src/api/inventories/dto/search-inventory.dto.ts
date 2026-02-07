import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class SearchInventoryDto {
    @ApiPropertyOptional({
        example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        description: 'Warehouse ID',
    })
    @IsOptional()
    @IsUUID()
    warehouse_id?: string;

    @ApiPropertyOptional({
        example: '2a1deb4d-3b7d-4bad-9bdd-2b0d7b3dc111',
        description: 'Material ID',
    })
    @IsOptional()
    @IsUUID()
    material_id?: string;
}
