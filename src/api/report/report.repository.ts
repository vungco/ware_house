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

            COALESCE(i.opening_import,0) - COALESCE(e.opening_export,0) AS "openingStock",
            COALESCE(i.period_import,0)  AS "importQuantity",
            COALESCE(e.period_export,0)  AS "exportQuantity",

            (COALESCE(i.opening_import,0) - COALESCE(e.opening_export,0)
            + COALESCE(i.period_import,0) - COALESCE(e.period_export,0)) AS "closingStock"

        FROM materials m

        LEFT JOIN (
            SELECT
                iri.material_id,
                SUM(CASE WHEN ir.created_at < $1 THEN iri.quantity ELSE 0 END) AS opening_import,
                SUM(CASE WHEN ir.created_at BETWEEN $2 AND $3 THEN iri.quantity ELSE 0 END) AS period_import
            FROM import_receipt_items iri
            JOIN import_receipts ir ON ir.id = iri.receipt_id
            WHERE ir.warehouse_id = $4
            GROUP BY iri.material_id
        ) i ON i.material_id = m.id

        LEFT JOIN (
            SELECT
                eri.material_id,
                SUM(CASE WHEN er.created_at < $1 THEN eri.quantity ELSE 0 END) AS opening_export,
                SUM(CASE WHEN er.created_at BETWEEN $2 AND $3 THEN eri.quantity ELSE 0 END) AS period_export
            FROM export_receipt_items eri
            JOIN export_receipts er ON er.id = eri.receipt_id
            WHERE er.warehouse_id = $4
            AND er.status = 'COMPLETED'
            GROUP BY eri.material_id
        ) e ON e.material_id = m.id

        ORDER BY m.name;

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
          ON er.id = eri.receipt_id
        JOIN materials m
          ON m.id = eri.material_id

        WHERE er.warehouse_id = $1
          AND er.created_at BETWEEN $2 AND $3
          AND er.status = 'COMPLETED'

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
        const defaultFrom = new Date('2025-01-01');
        const defaultTo = new Date();

        const from = fromDate ? new Date(fromDate) : defaultFrom;
        const to = toDate ? new Date(toDate) : defaultTo;

        // cộng thêm 1 ngày
        to.setDate(to.getDate() + 1);

        return {
            from: from.toISOString(),
            to: to.toISOString(),
        };
    }
}
