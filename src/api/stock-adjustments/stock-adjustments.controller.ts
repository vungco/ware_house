import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { StockAdjustmentsService } from "./stock-adjustments.service";
import { CreateStockAdjustmentDto } from "./dto/create-stock-adjustment.dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";
import { FindStockAdjustmentDto } from "./dto/find-stock.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller('stock-adjustments')
@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard)
export class StockAdjustmentsController {
  constructor(private readonly service: StockAdjustmentsService) {}

  @Post()
  create(
    @Body() dto: CreateStockAdjustmentDto,
    @CurrentUser() user: User,
  ) {
    return this.service.create(dto, user);
  }

  @Get()
  findAll(@Query() query: FindStockAdjustmentDto) {
    return this.service.findAll(query);
  }
}
