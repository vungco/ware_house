import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { User } from '../users/entities/user.entity';
import { AuditAction } from '../audit-logs/entities/audit-log.entity';
import { RoleName } from '../roles/entities/role.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class WarehousesService {
    constructor(
        @InjectRepository(Warehouse)
        private readonly warehouseRepo: Repository<Warehouse>,
        private readonly auditLogsService: AuditLogsService,
        private readonly usersService: UsersService,
    ) {}

    // ================= CREATE =================
    async create(dto: CreateWarehouseDto, currentUser: User) {
        const keeper = await this.usersService.findOne(dto.user_id);

        const isThuKho = keeper.roles.some((role) => role.name === RoleName.THU_KHO);

        if (!isThuKho) {
            throw new BadRequestException('User này không phải thủ kho');
        }

        const exists = await this.warehouseRepo.findOne({
            where: { code: dto.code },
        });

        if (exists) {
            throw new ConflictException('Mã kho đã tồn tại');
        }

        const warehouse = this.warehouseRepo.create({
            ...dto,
            status: dto.status,
            user_id: keeper.id,
        });

        await this.warehouseRepo.save(warehouse);

        await this.auditLogsService.create({
            userId: currentUser.id,
            action: AuditAction.CREATE,
            entityName: 'Warehouse',
            entityId: warehouse.id,
            newValue: dto,
        });

        return warehouse;
    }

    // ================= FIND ALL =================
    async findAll() {
        return this.warehouseRepo.find({
            order: { created_at: 'DESC' },
        });
    }

    // ================= FIND ONE =================
    async findOne(id: string) {
        const warehouse = await this.warehouseRepo.findOne({
            where: { id },
        });

        if (!warehouse) {
            throw new NotFoundException('Kho không tồn tại');
        }

        return warehouse;
    }

    // ================= UPDATE =================
    async update(id: string, dto: UpdateWarehouseDto, currentUser: User) {
        const warehouse = await this.findOne(id);

        const isManager = currentUser.roles.some((r) => r.name === RoleName.QUAN_LY);

        const isThuKho = currentUser.roles.some((r) => r.name === RoleName.THU_KHO);

        // ===== CHECK PERMISSION =====
        if (!isManager) {
            // Phải là thủ kho của kho này
            if (!isThuKho || warehouse.user_id !== currentUser.id) {
                throw new ForbiddenException('Bạn không có quyền cập nhật kho này');
            }

            // ❌ Thủ kho không được đổi người phụ trách
            if (dto.user_id && dto.user_id !== warehouse.user_id) {
                throw new ForbiddenException('Thủ kho không được thay đổi người phụ trách kho');
            }
        }

        if (isManager && dto.user_id) {
            const keeper = await this.usersService.findOne(dto.user_id);

            const isKeeper = keeper.roles.some((r) => r.name === RoleName.THU_KHO);

            if (!isKeeper) {
                throw new BadRequestException('User được gán phải là thủ kho');
            }
        }

        const oldValue = { ...warehouse };

        Object.assign(warehouse, dto);
        await this.warehouseRepo.save(warehouse);

        await this.auditLogsService.create({
            userId: currentUser.id,
            action: AuditAction.UPDATE,
            entityName: 'Warehouse',
            entityId: warehouse.id,
            oldValue,
            newValue: dto,
        });

        return warehouse;
    }

    // ================= DELETE (SOFT) =================
    async remove(id: string, currentUser: User) {
        const warehouse = await this.findOne(id);

        await this.warehouseRepo.softRemove(warehouse);

        await this.auditLogsService.create({
            userId: currentUser.id,
            action: AuditAction.DELETE,
            entityName: 'Warehouse',
            entityId: warehouse.id,
            oldValue: {
                code: warehouse.code,
                name: warehouse.name,
            },
        });

        return { success: true };
    }
}
