import { Controller, Get, Post, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExportReceiptsService } from './export-receipts.service';
import { CreateExportReceiptDto } from './dto/create-export-receipt.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { RolesGuard } from '../auth/decorators/roles.guard';

@ApiTags('Export Receipts')
@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('export-receipts')
export class ExportReceiptsController {
    constructor(private readonly exportReceiptsService: ExportReceiptsService) {}

    // ================= CREATE =================
    @Roles(RoleName.QUAN_LY, RoleName.THU_KHO)
    @Post()
    create(@Body() dto: CreateExportReceiptDto, @CurrentUser() user: User) {
        return this.exportReceiptsService.create(dto, user);
    }

    // ================= FIND ALL =================
    @Get()
    findAll() {
        return this.exportReceiptsService.findAll();
    }

    // ================= FIND ONE =================
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.exportReceiptsService.findOne(id);
    }

    // ================= CANCEL =================
    @Roles(RoleName.QUAN_LY)
    @Patch(':id/cancel')
    cancel(@Param('id') id: string, @CurrentUser() user: User) {
        return this.exportReceiptsService.cancel(id, user);
    }

    @Roles(RoleName.QUAN_LY)
    @Patch(':id/complete')
    complete(@Param('id') id: string, @CurrentUser() user: User) {
        return this.exportReceiptsService.complete(id, user);
    }
}
