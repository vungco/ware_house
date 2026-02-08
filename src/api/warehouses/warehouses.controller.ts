import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { RolesGuard } from '../auth/decorators/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('warehouses')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('Authorization')
export class WarehousesController {
    constructor(private readonly warehousesService: WarehousesService) {}

    @Post()
    @Roles(RoleName.QUAN_LY)
    create(@Body() dto: CreateWarehouseDto, @CurrentUser() user: User) {
        return this.warehousesService.create(dto, user);
    }

    @Get()
    findAll() {
        return this.warehousesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.warehousesService.findOne(id);
    }

    @Roles(RoleName.QUAN_LY, RoleName.THU_KHO)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateWarehouseDto, @CurrentUser() user: User) {
        return this.warehousesService.update(id, dto, user);
    }

    @Roles(RoleName.QUAN_LY)
    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user: User) {
        return this.warehousesService.remove(id, user);
    }
}
