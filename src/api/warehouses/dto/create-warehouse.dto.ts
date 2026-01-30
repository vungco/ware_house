import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { WarehouseStatus } from '../entities/warehouse.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWarehouseDto {
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    location?: string;

    @ApiProperty({
        example: 'quanly@warehouse.local',
        description: 'Email đăng nhập',
    })
    @IsEnum(WarehouseStatus)
    status: WarehouseStatus;
}
