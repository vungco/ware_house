import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMaterialDto {
  @ApiProperty({
    example: 'MAT001',
    description: 'Mã vật tư, duy nhất trong hệ thống',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  code: string;

  @ApiProperty({
    example: 'Xi măng PCB40',
    description: 'Tên vật tư',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  name: string;

  @ApiProperty({
    example: 'bao',
    description: 'Đơn vị tính của vật tư',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  unit: string;

  @ApiPropertyOptional({
    example: 'Vật tư xây dựng dùng cho kho trung tâm',
    description: 'Mô tả chi tiết vật tư',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
