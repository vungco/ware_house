import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';
import { User } from '../../users/entities/user.entity';
import { ReceiptStatus } from '../../import-receipts/entities/import-receipt.entity';
import { ExportReceiptItem } from './export-receipt-item.entity';

@Entity('export_receipts')
export class ExportReceipt extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Index()
  @Column({ type: 'uuid' })
  warehouse_id: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  created_by?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reason?: string | null;

  @Column({ type: 'varchar', length: 20, default: ReceiptStatus.DRAFT })
  status: ReceiptStatus;

  @ManyToOne(() => Warehouse, (w) => w.export_receipts, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  creator?: User | null;

  @OneToMany(() => ExportReceiptItem, (i) => i.receipt, { cascade: false })
  items: ExportReceiptItem[];
}
