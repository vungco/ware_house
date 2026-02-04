import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/decorators/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Accounts')
@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @Roles(RoleName.QUAN_LY, RoleName.KE_TOAN)
  create(@Body() dto: CreateAccountDto) {
    return this.accountsService.create(dto);
  }

  @Get()
  @Roles(RoleName.QUAN_LY, RoleName.KE_TOAN)
  findAll() {
    return this.accountsService.findAll();
  }

  @Get(':id')
  @Roles(RoleName.QUAN_LY, RoleName.KE_TOAN)
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleName.QUAN_LY, RoleName.KE_TOAN)
  update(@Param('id') id: string, @Body() dto: UpdateAccountDto) {
    return this.accountsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RoleName.QUAN_LY)
  remove(@Param('id') id: string) {
    return this.accountsService.remove(id);
  }
}
