import {
  ConflictException,
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

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  // ================= CREATE =================
  async create(dto: CreateWarehouseDto, currentUser: User) {
    const exists = await this.warehouseRepo.findOne({
      where: { code: dto.code },
    });

    if (exists) {
      throw new ConflictException('Mã kho đã tồn tại');
    }

    const warehouse = this.warehouseRepo.create({
      ...dto,
      status: dto.status,
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
  async update(
    id: string,
    dto: UpdateWarehouseDto,
    currentUser: User,
  ) {
    const warehouse = await this.findOne(id);
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
