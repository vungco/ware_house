import { AuditAction } from "../entities/audit-log.entity";

export class CreateAuditLogDto {
  userId?: string;
  action: AuditAction;
  entityName: string;
  entityId?: string;
  oldValue?: any;
  newValue?: any;
  ip?: string;
  userAgent?: string;
}
