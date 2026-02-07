import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { Repository } from 'typeorm';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { User } from '../users/entities/user.entity';
import { AuditAction } from '../audit-logs/entities/audit-log.entity';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { SearchInventoryDto } from './dto/search-inventory.dto';

@Injectable()
export class InventoriesService {
    constructor(
        @InjectRepository(Inventory)
        private readonly inventoryRepo: Repository<Inventory>,

        private readonly auditLogsService: AuditLogsService,
    ) {}

    // ================= CREATE =================
    async create(dto: CreateInventoryDto, currentUser: User) {
        const exists = await this.inventoryRepo.findOne({
            where: {
                warehouse_id: dto.warehouse_id,
                material_id: dto.material_id,
            },
        });

        if (exists) {
            throw new BadRequestException('Inventory đã tồn tại cho warehouse + material này');
        }

        const inventory = this.inventoryRepo.create({
            warehouse_id: dto.warehouse_id,
            material_id: dto.material_id,
            quantity: dto.quantity ?? 0,
            min_quantity: dto.min_quantity ?? 0,
        });

        await this.inventoryRepo.save(inventory);

        await this.auditLogsService.create({
            userId: currentUser.id,
            action: AuditAction.CREATE,
            entityName: 'Inventory',
            entityId: inventory.id,
            newValue: {
                warehouse_id: inventory.warehouse_id,
                material_id: inventory.material_id,
                quantity: inventory.quantity,
                min_quantity: inventory.min_quantity,
            },
        });

        return inventory;
    }

    // ================= READ =================
    async findAll() {
        return this.inventoryRepo.find({
            relations: ['warehouse', 'material'],
            order: { created_at: 'DESC' },
        });
    }

    async findOne(id: string) {
        const inventory = await this.inventoryRepo.findOne({
            where: { id },
            relations: ['warehouse', 'material'],
        });

        if (!inventory) {
            throw new NotFoundException('Inventory không tồn tại');
        }

        return inventory;
    }

    async search(query: SearchInventoryDto) {
        return this.inventoryRepo.find({
            where: {
                ...(query.warehouse_id && { warehouse_id: query.warehouse_id }),
                ...(query.material_id && { material_id: query.material_id }),
            },
            relations: ['warehouse', 'material'],
            order: { created_at: 'DESC' },
        });
    }

    // ================= UPDATE =================
    async update(id: string, dto: UpdateInventoryDto, currentUser: User) {
        const inventory = await this.findOne(id);

        const oldValue = {
            quantity: inventory.quantity,
            min_quantity: inventory.min_quantity,
        };

        Object.assign(inventory, dto);
        await this.inventoryRepo.save(inventory);

        await this.auditLogsService.create({
            userId: currentUser.id,
            action: AuditAction.UPDATE,
            entityName: 'Inventory',
            entityId: inventory.id,
            oldValue,
            newValue: dto,
        });

        return inventory;
    }

    // ================= DELETE =================
    async remove(id: string, currentUser: User) {
        const inventory = await this.findOne(id);

        await this.inventoryRepo.remove(inventory);

        await this.auditLogsService.create({
            userId: currentUser.id,
            action: AuditAction.DELETE,
            entityName: 'Inventory',
            entityId: inventory.id,
            oldValue: {
                warehouse_id: inventory.warehouse_id,
                material_id: inventory.material_id,
                quantity: inventory.quantity,
                min_quantity: inventory.min_quantity,
            },
        });

        return { message: 'Đã xoá inventory' };
    }
}
