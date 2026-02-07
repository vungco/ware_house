import { Controller, Get, Post, Body, Param, Patch, UseGuards, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ImportReceiptsService } from './import-receipts.service';
import { CreateImportReceiptDto } from './dto/create-import-receipt.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { RolesGuard } from '../auth/decorators/roles.guard';

@ApiTags('Import Receipts')
@ApiBearerAuth('Authorization')
@Controller('import-receipts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ImportReceiptsController {
    constructor(private readonly service: ImportReceiptsService) {}

    @Post()
    @Roles(RoleName.QUAN_LY, RoleName.THU_KHO)
    create(@Body() dto: CreateImportReceiptDto, @CurrentUser() user: User) {
        return this.service.create(dto, user);
    }

    @Roles(RoleName.QUAN_LY)
    @Patch(':id/complete')
    @Roles(RoleName.THU_KHO)
    complete(@Param('id') id: string, @CurrentUser() user: User) {
        return this.service.complete(id, user);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Roles(RoleName.QUAN_LY)
    @Patch(':id/cancel')
    cancel(@Param('id') id: string, @CurrentUser() user: User) {
        return this.service.cancel(id, user);
    }

    @Roles(RoleName.QUAN_LY)
    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user: User) {
        return this.service.remove(id, user);
    }
}
