import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsUUID,
    IsString,
    IsOptional,
    IsNumber,
    Min,
    ValidateNested,
    IsArray,
} from 'class-validator';

export class CreateExportReceiptDto {
    @ApiProperty({
        example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        description: 'ID kho xuất hàng',
    })
    @IsUUID()
    warehouse_id: string;

    @ApiPropertyOptional({
        example: 'Xuất hàng cho sản xuất',
        description: 'Lý do xuất kho',
    })
    @IsOptional()
    @IsString()
    reason?: string;

    @ApiProperty({
        type: () => [CreateExportReceiptItemDto],
        description: 'Danh sách vật tư xuất kho',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateExportReceiptItemDto)
    items: CreateExportReceiptItemDto[];
}

export class CreateExportReceiptItemDto {
    @ApiProperty({
        example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
        description: 'ID vật tư',
    })
    @IsUUID()
    material_id: string;

    @ApiProperty({
        example: 5.5,
        description: 'Số lượng xuất (phải > 0)',
    })
    @IsNumber()
    @Min(0.001)
    quantity: number;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    price: number;
}
