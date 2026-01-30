import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Material } from './entities/material.entity';
import { IsNull, Repository } from 'typeorm';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../audit-logs/entities/audit-log.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { User } from '../users/entities/user.entity';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialsService {
    constructor(
        @InjectRepository(Material)
        private readonly materialRepository: Repository<Material>,
        private readonly auditLogsService: AuditLogsService,
    ) {}
    async create(dto: CreateMaterialDto, currentUser: User) {
        const existed = await this.materialRepository.findOne({
            where: { code: dto.code },
        });

        if (existed) {
            throw new BadRequestException('Material code already exists');
        }

        const material = this.materialRepository.create(dto);
        await this.materialRepository.save(material);

        await this.auditLogsService.create({
            userId: currentUser.id,
            action: AuditAction.CREATE,
            entityName: 'Material',
            entityId: material.id,
            newValue: material,
        });

        return material;
    }

    findAll() {
        return this.materialRepository.find({
            where: { deleted_at: IsNull() },
            order: { created_at: 'DESC' },
        });
    }

    async findOne(id: string) {
        const material = await this.materialRepository.findOne({
            where: { id, deleted_at: IsNull() },
        });

        if (!material) {
            throw new NotFoundException('Material not found');
        }

        return material;
    }
    async update(id: string, dto: UpdateMaterialDto, currentUser: User) {
        const material = await this.findOne(id);

        const oldValue = { ...material };

        Object.assign(material, dto);
        await this.materialRepository.save(material);

        await this.auditLogsService.create({
            userId: currentUser.id,
            action: AuditAction.UPDATE,
            entityName: 'Material',
            entityId: material.id,
            oldValue,
            newValue: material,
        });

        return material;
    }
    async remove(id: string, currentUser: User) {
        const material = await this.materialRepository.findOne({
            where: { id },
            relations: ['inventories', 'import_items', 'export_items', 'stock_adjustments'],
        });

        if (!material) {
            throw new NotFoundException('Material not found');
        }

        if (
            material.import_items.length ||
            material.export_items.length ||
            material.stock_adjustments.length
        ) {
            throw new BadRequestException('Material has transactions, cannot delete');
        }

        await this.materialRepository.softRemove(material);

        await this.auditLogsService.create({
            userId: currentUser.id,
            action: AuditAction.DELETE,
            entityName: 'Material',
            entityId: material.id,
            oldValue: material,
        });

        return { message: 'Material deleted successfully' };
    }
}
