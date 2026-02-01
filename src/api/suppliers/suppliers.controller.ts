import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { RolesGuard } from '../auth/decorators/roles.guard';

@ApiTags('Suppliers')
@ApiBearerAuth('Authorization')
@Controller('suppliers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuppliersController {
    constructor(private readonly suppliersService: SuppliersService) {}

    @Post()
    @Roles(RoleName.QUAN_LY)
    create(@Body() dto: CreateSupplierDto, @CurrentUser() currentUser: User) {
        return this.suppliersService.create(dto, currentUser);
    }

    @Get()
    findAll() {
        return this.suppliersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.suppliersService.findOne(id);
    }

    @Patch(':id')
    @Roles(RoleName.QUAN_LY)
    update(
        @Param('id') id: string,
        @Body() dto: UpdateSupplierDto,
        @CurrentUser() currentUser: User,
    ) {
        return this.suppliersService.update(id, dto, currentUser);
    }

    @Delete(':id')
    @Roles(RoleName.QUAN_LY)
    remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
        return this.suppliersService.remove(id, currentUser);
    }
}
