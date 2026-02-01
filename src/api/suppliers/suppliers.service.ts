import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { User } from '../users/entities/user.entity';
import { AuditAction } from '../audit-logs/entities/audit-log.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  // CREATE
  async create(dto: CreateSupplierDto, currentUser: User) {
    const supplier = this.supplierRepository.create(dto);
    await this.supplierRepository.save(supplier);

    await this.auditLogsService.create({
      userId: currentUser.id,
      action: AuditAction.CREATE,
      entityName: 'Supplier',
      entityId: supplier.id,
      newValue: supplier,
    });

    return supplier;
  }

  // READ ALL
  findAll() {
    return this.supplierRepository.find();
  }

  // READ ONE
  async findOne(id: string) {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
    });

    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  // UPDATE
  async update(id: string, dto: UpdateSupplierDto, currentUser: User) {
    const supplier = await this.findOne(id);
    const oldValue = { ...supplier };

    Object.assign(supplier, dto);
    await this.supplierRepository.save(supplier);

    await this.auditLogsService.create({
      userId: currentUser.id,
      action: AuditAction.UPDATE,
      entityName: 'Supplier',
      entityId: supplier.id,
      oldValue,
      newValue: supplier,
    });

    return supplier;
  }

  // DELETE (soft)
  async remove(id: string, currentUser: User) {
    const supplier = await this.findOne(id);

    await this.supplierRepository.softRemove(supplier);

    await this.auditLogsService.create({
      userId: currentUser.id,
      action: AuditAction.DELETE,
      entityName: 'Supplier',
      entityId: supplier.id,
      oldValue: supplier,
    });

    return { message: 'Supplier deleted successfully' };
  }
}
