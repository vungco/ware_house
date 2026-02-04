import {
    Injectable,
    InternalServerErrorException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { DataSource, QueryFailedError } from 'typeorm';
import { InventorySummaryQuery } from './dto/inventory-summary.query';
import { TopExportQuery } from './dto/top-export.query';

@Injectable()
export class ReportRepository {
    constructor(private readonly dataSource: DataSource) {}

    // ======================================
    // BÁO CÁO TỒN KHO TỔNG HỢP
    // ======================================
    async getInventorySummary(query: InventorySummaryQuery) {
        const { warehouseId, fromDate, toDate } = query;

        const { from, to } = this.normalizeDateRange(fromDate, toDate);

        try {
            return await this.dataSource.query(
                `
        SELECT
          m.id   AS "materialId",
          m.code AS "materialCode",
          m.name AS "materialName",
          m.unit AS "unit",

          COALESCE(
            SUM(CASE WHEN ir.created_at < $1 THEN iri.quantity ELSE 0 END),
            0
          )
          -
          COALESCE(
            SUM(CASE WHEN er.created_at < $1 THEN eri.quantity ELSE 0 END),
            0
          ) AS "openingStock",

          COALESCE(
            SUM(CASE WHEN ir.created_at BETWEEN $2 AND $3 THEN iri.quantity ELSE 0 END),
            0
          ) AS "importQuantity",

          COALESCE(
            SUM(CASE WHEN er.created_at BETWEEN $2 AND $3 THEN eri.quantity ELSE 0 END),
            0
          ) AS "exportQuantity"

        FROM materials m

        LEFT JOIN import_receipt_items iri
          ON iri.material_id = m.id

        LEFT JOIN import_receipts ir
          ON ir.id = iri.id
         AND ir.warehouse_id = $4

        LEFT JOIN export_receipt_items eri
          ON eri.material_id = m.id

        LEFT JOIN export_receipts er
          ON er.id = eri.id
         AND er.warehouse_id = $4

        GROUP BY
          m.id, m.code, m.name, m.unit

        ORDER BY m.name
        `,
                [from, from, to, warehouseId],
            );
        } catch (error) {
            Logger.error(error, 'ReportRepository.getInventorySummary');

            if (error instanceof QueryFailedError) {
                throw new BadRequestException('Invalid inventory summary query parameters');
            }

            throw new InternalServerErrorException('Failed to get inventory summary');
        }
    }

    // ======================================
    // TOP VẬT TƯ XUẤT KHO NHIỀU NHẤT
    // ======================================
    async getTopExportMaterials(query: TopExportQuery) {
        const { warehouseId, fromDate, toDate, limit } = query;

        const { from, to } = this.normalizeDateRange(fromDate, toDate);

        try {
            return await this.dataSource.query(
                `
        SELECT
          m.id   AS "materialId",
          m.name AS "materialName",
          SUM(eri.quantity) AS "exportQuantity"

        FROM export_receipt_items eri
        JOIN export_receipts er
          ON er.id = eri.id
        JOIN materials m
          ON m.id = eri.material_id

        WHERE er.warehouse_id = $1
          AND er.created_at BETWEEN $2 AND $3

        GROUP BY m.id, m.name
        ORDER BY "exportQuantity" DESC
        LIMIT $4
        `,
                [warehouseId, from, to, limit ?? 5],
            );
        } catch (error) {
            Logger.error(error, 'ReportRepository.getTopExportMaterials');

            if (error instanceof QueryFailedError) {
                throw new BadRequestException('Invalid top export query parameters');
            }

            throw new InternalServerErrorException('Failed to get top export materials');
        }
    }

    // ======================================
    // CƠ CẤU TỒN KHO
    // ======================================
    async getInventoryStructure(warehouseId: string) {
        try {
            return await this.dataSource.query(
                `
        SELECT
          m.id   AS "materialId",
          m.name AS "materialName",
          i.quantity AS "quantity"

        FROM inventories i
        JOIN materials m
          ON m.id = i.material_id

        WHERE i.warehouse_id = $1
        ORDER BY m.name
        `,
                [warehouseId],
            );
        } catch (error) {
            Logger.error(error, 'ReportRepository.getInventoryStructure');

            if (error instanceof QueryFailedError) {
                throw new BadRequestException('Invalid inventory structure query parameters');
            }

            throw new InternalServerErrorException('Failed to get inventory structure');
        }
    }

    private normalizeDateRange(fromDate?: string, toDate?: string) {
        const defaultFrom = '2025-01-01';
        const defaultTo = new Date().toISOString().slice(0, 10);

        return {
            from: fromDate ?? defaultFrom,
            to: toDate ?? defaultTo,
        };
    }
}
