import { Column, Entity, Index, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Inventory } from '../../inventories/entities/inventory.entity';
import { ImportReceipt } from '../../import-receipts/entities/import-receipt.entity';
import { ExportReceipt } from '../../export-receipts/entities/export-receipt.entity';
import { StockAdjustment } from '../../stock-adjustments/entities/stock-adjustment.entity';
import { User } from '../../users/entities/user.entity';

export enum WarehouseStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('warehouses')
export class Warehouse extends BaseEntity {

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 40 })
  code: string;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string | null;

  @Column({ type: 'varchar', length: 20, default: WarehouseStatus.ACTIVE })
  status: WarehouseStatus;

  // ===== USER RELATION =====
  @Index()
  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @ManyToOne(() => User, (u) => u.warehouses, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // ===== EXISTING RELATIONS =====
  @OneToMany(() => Inventory, (inv) => inv.warehouse)
  inventories: Inventory[];

  @OneToMany(() => ImportReceipt, (r) => r.warehouse)
  import_receipts: ImportReceipt[];

  @OneToMany(() => ExportReceipt, (r) => r.warehouse)
  export_receipts: ExportReceipt[];

  @OneToMany(() => StockAdjustment, (a) => a.warehouse)
  stock_adjustments: StockAdjustment[];
}
