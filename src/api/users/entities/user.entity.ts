import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Role } from '../../roles/entities/role.entity';
import { AuditLog } from '../../audit-logs/entities/audit-log.entity';
import { ImportReceipt } from '../../import-receipts/entities/import-receipt.entity';
import { ExportReceipt } from '../../export-receipts/entities/export-receipt.entity';
import { StockAdjustment } from '../../stock-adjustments/entities/stock-adjustment.entity';
import { Warehouse } from 'src/api/warehouses/entities/warehouse.entity';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('users')
export class User extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 80 })
  user_name: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Column({ type: 'varchar', length: 120 })
  full_name: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  email?: string | null;

  @Column({ type: 'varchar', length: 20, default: UserStatus.ACTIVE })
  status: UserStatus;

  // ===== ROLE =====
  @ManyToMany(() => Role, (r) => r.users, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  // ===== AUDIT LOG =====
  @OneToMany(() => AuditLog, (l) => l.user)
  audit_logs: AuditLog[];

  // ===== IMPORT RECEIPT =====
  @OneToMany(() => ImportReceipt, (r) => r.creator)
  import_receipts: ImportReceipt[];

  // ===== EXPORT RECEIPT =====
  @OneToMany(() => ExportReceipt, (r) => r.creator)
  export_receipts: ExportReceipt[];

  // ===== STOCK ADJUSTMENT =====
  @OneToMany(() => StockAdjustment, (a) => a.creator)
  stock_adjustments: StockAdjustment[];

    // ===== WAREHOUSE =====
  @OneToMany(() => Warehouse, (w) => w.user)
  warehouses: Warehouse[];
}
