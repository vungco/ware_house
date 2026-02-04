import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AccountType, AccountStatus } from '../entities/account.entity';

export class CreateAccountDto {

  @ApiProperty({ example: '156' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Hàng tồn kho' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: AccountType })
  @IsEnum(AccountType)
  type: AccountType;

  @ApiProperty({ enum: AccountStatus })
  @IsEnum(AccountStatus)
  status: AccountStatus;
}
