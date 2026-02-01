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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard } from '../auth/decorators/roles.guard';
import { User } from '../users/entities/user.entity';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.QUAN_LY)
@ApiBearerAuth('Authorization')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  // ================= CREATE =================
  @Post()
  create(
    @Body() createMaterialDto: CreateMaterialDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.materialsService.create(createMaterialDto, currentUser);
  }

  // ================= READ =================
  @Get()
  findAll() {
    return this.materialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialsService.findOne(id);
  }

  // ================= UPDATE =================
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.materialsService.update(id, updateMaterialDto, currentUser);
  }

  // ================= DELETE =================
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.materialsService.remove(id, currentUser);
  }
}
