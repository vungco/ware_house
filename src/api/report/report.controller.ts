import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { InventorySummaryQuery } from './dto/inventory-summary.query';
import { TopExportQuery } from './dto/top-export.query';
import { RolesGuard } from '../auth/decorators/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('reports')
@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    // BẢNG BÁO CÁO TỒN KHO
    @Get('inventory-summary')
    getInventorySummary(@Query() query: InventorySummaryQuery) {
        return this.reportService.getInventorySummary(query);
    }

    // TOP VẬT TƯ XUẤT NHIỀU NHẤT
    @Get('top-export-materials')
    getTopExportMaterials(@Query() query: TopExportQuery) {
        return this.reportService.getTopExportMaterials(query);
    }

    // CƠ CẤU TỒN KHO
    @Get('inventory-structure')
    getInventoryStructure(@Query('warehouseId') warehouseId: string) {
        return this.reportService.getInventoryStructure(warehouseId);
    }

    // XUẤT EXCEL
    @Get('inventory-summary/export')
    exportInventorySummary(@Query() query: InventorySummaryQuery) {
        return this.reportService.exportInventorySummary(query);
    }
}
