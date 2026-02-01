import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { UserStatus } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'thukho01' })
  @IsNotEmpty()
  user_name: string;

  @ApiProperty({ example: 'quanly@company.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Thủ kho A' })
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: '123456' })
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: UserStatus, default: UserStatus.ACTIVE })
  @IsEnum(UserStatus)
  status: UserStatus;

  @ApiProperty({ example: ['THU_KHO'] })
  roles: string[];
}
