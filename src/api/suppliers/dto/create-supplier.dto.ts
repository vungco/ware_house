import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({
    example: 'SUP001',
    description: 'Mã nhà cung cấp, duy nhất trong hệ thống',
  })
  @IsString()
  @Length(1, 40)
  code: string;

  @ApiProperty({
    example: 'Công ty TNHH ABC',
    description: 'Tên nhà cung cấp',
  })
  @IsString()
  @Length(1, 160)
  name: string;

  @ApiPropertyOptional({
    example: '0909123456',
    description: 'Số điện thoại liên hệ',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'contact@abc.com',
    description: 'Email liên hệ',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'Thanh Xuân, Hà Nội',
    description: 'Địa chỉ nhà cung cấp',
  })
  @IsOptional()
  @IsString()
  address?: string;
}
