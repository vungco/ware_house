import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  unit: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
