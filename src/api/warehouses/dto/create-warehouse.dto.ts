import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { WarehouseStatus } from '../entities/warehouse.entity';

export class CreateWarehouseDto {

  @ApiProperty({
    example: 'WH_001',
    description: 'Mã kho (duy nhất)',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: 'Kho Hà Nội',
    description: 'Tên kho',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Thanh Xuân, Hà Nội',
    description: 'Vị trí kho',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    enum: WarehouseStatus,
    example: WarehouseStatus.ACTIVE,
    description: 'Trạng thái kho',
  })
  @IsEnum(WarehouseStatus)
  status: WarehouseStatus;

  // ===== USER PHỤ TRÁCH =====
  @ApiProperty({
    example: 'uuid-user-id',
    description: 'User phụ trách kho',
  })
  @IsUUID()
  user_id: string;
}
