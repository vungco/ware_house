import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/decorators/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';
import { InventoriesService } from './inventories.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SearchInventoryDto } from './dto/search-inventory.dto';

@Controller('inventories')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('Authorization')
export class InventoriesController {
    constructor(private readonly inventoriesService: InventoriesService) {}

    @Roles(RoleName.QUAN_LY, RoleName.THU_KHO)
    @Post()
    create(@Body() dto: CreateInventoryDto, @CurrentUser() currentUser: User) {
        return this.inventoriesService.create(dto, currentUser);
    }

    @Get()
    findAll() {
        return this.inventoriesService.findAll();
    }
    
    @Get('search')
    find(@Query() query: SearchInventoryDto) {
        return this.inventoriesService.search(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.inventoriesService.findOne(id);
    }


    @Roles(RoleName.QUAN_LY, RoleName.THU_KHO)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateInventoryDto,
        @CurrentUser() currentUser: User,
    ) {
        return this.inventoriesService.update(id, dto, currentUser);
    }

    @Roles(RoleName.QUAN_LY, RoleName.THU_KHO)
    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
        return this.inventoriesService.remove(id, currentUser);
    }
}
