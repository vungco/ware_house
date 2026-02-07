import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/decorators/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Accounts')
@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('accounts')
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) {}

    @Post()
    @Roles(RoleName.QUAN_LY)
    create(@Body() dto: CreateAccountDto, @CurrentUser() user: User) {
        return this.accountsService.create(dto, user.id);
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
    update(@Param('id') id: string, @Body() dto: UpdateAccountDto, @CurrentUser() user: User) {
        return this.accountsService.update(id, dto, user.id);
    }

    @Delete(':id')
    @Roles(RoleName.QUAN_LY)
    remove(@Param('id') id: string, @CurrentUser() user: User) {
        return this.accountsService.remove(id, user.id);
    }
}
