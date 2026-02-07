import { Controller, Post, Body, Get, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { JournalEntriesService } from './journal-entries.service';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/decorators/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Journal Entries')
@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('journal-entries')
export class JournalEntriesController {
    constructor(private readonly service: JournalEntriesService) {}

    @Post()
    @Roles(RoleName.QUAN_LY, RoleName.KE_TOAN)
    create(@Body() dto: CreateJournalEntryDto, @CurrentUser() currentUser: User) {
        return this.service.create(dto, currentUser.id);
    }

    @Get()
    @Roles(RoleName.QUAN_LY, RoleName.KE_TOAN)
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    @Roles(RoleName.QUAN_LY, RoleName.KE_TOAN)
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Delete(':id')
    @Roles(RoleName.QUAN_LY)
    remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
        return this.service.remove(id, currentUser.id);
    }
}
