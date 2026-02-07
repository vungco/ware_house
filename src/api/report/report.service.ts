import { Injectable } from '@nestjs/common';
import { InventorySummaryQuery } from './dto/inventory-summary.query';
import { TopExportQuery } from './dto/top-export.query';
import { ReportRepository } from './report.repository';

@Injectable()
export class ReportService {
  constructor(private readonly repo: ReportRepository) {}

  async getInventorySummary(query: InventorySummaryQuery) {
    return this.repo.getInventorySummary(query);
  }

  async getTopExportMaterials(query: TopExportQuery) {
    return this.repo.getTopExportMaterials(query);
  }

  async getInventoryStructure(warehouseId: string) {
    return this.repo.getInventoryStructure(warehouseId);
  }
}
