import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { StockAdjustmentsService } from './stock-adjustments.service';
import { CreateStockAdjustmentDto } from './dto/create-stock-adjustment.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { FindStockAdjustmentDto } from './dto/find-stock.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';

@Controller('stock-adjustments')
@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard)
export class StockAdjustmentsController {
    constructor(private readonly service: StockAdjustmentsService) {}

    @Roles(RoleName.QUAN_LY, RoleName.THU_KHO)
    @Post()
    create(@Body() dto: CreateStockAdjustmentDto, @CurrentUser() user: User) {
        return this.service.create(dto, user);
    }

    @Get()
    findAll(@Query() query: FindStockAdjustmentDto) {
        return this.service.findAll(query);
    }
}
