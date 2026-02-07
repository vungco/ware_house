import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StocktakesService } from './stocktakes.service';
import { CreateStocktakeDto } from './dto/create-stocktake.dto';
import { UpdateStocktakeDto } from './dto/update-stocktake.dto';
import { StocktakeQueryDto } from './dto/query-stocktake.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';

@ApiTags('Stocktakes')
@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard)
@Controller('stocktakes')
export class StocktakesController {
  constructor(private readonly service: StocktakesService) {}

  @Roles(RoleName.QUAN_LY, RoleName.THU_KHO)
  @Post()
  create(@Body() dto: CreateStocktakeDto,@CurrentUser() user: User) {
    return this.service.create(dto,user);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('search')
  search(@Query() query: StocktakeQueryDto) {
    return this.service.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Roles(RoleName.QUAN_LY, RoleName.THU_KHO)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStocktakeDto,@CurrentUser() user: User) {
    return this.service.update(id, dto,user);
  }

  @Roles(RoleName.QUAN_LY)
  @Delete(':id')
  remove(@Param('id') id: string,@CurrentUser() user: User) {
    return this.service.remove(id,user);
  }

  @Roles(RoleName.QUAN_LY)
  @Post(':id/approve')
  approve(@Param('id') id: string, @CurrentUser() user: User) {
    return this.service.approve(id, user);
  }

  @Roles(RoleName.QUAN_LY)
  @Post(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: User) {
    return this.service.cancel(id, user);
  }
}
