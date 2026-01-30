import { Injectable } from '@nestjs/common';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async create(data: CreateAuditLogDto): Promise<void> {
    const auditLog = this.auditLogRepository.create({
      user_id: data.userId ?? null,
      action: data.action,
      entity_name: data.entityName,
      entity_id: data.entityId ?? null,
      old_value: data.oldValue ?? null,
      new_value: data.newValue ?? null,
      ip: data.ip ?? null,
      user_agent: data.userAgent ?? null,
    });

    await this.auditLogRepository.save(auditLog);
  }
}
