import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { User } from '../../users/entities/user.entity';
import { ImportReceiptItem } from './import-receipt-item.entity';

export enum ReceiptStatus {
  DRAFT = 'DRAFT',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

@Entity('import_receipts')
export class ImportReceipt extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Index()
  @Column({ type: 'uuid' })
  warehouse_id: string;

  @Index()
  @Column({ type: 'uuid' })
  supplier_id: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  created_by?: string | null;

  @Column({ type: 'varchar', length: 20, default: ReceiptStatus.DRAFT })
  status: ReceiptStatus;

  @ManyToOne(() => Warehouse, (w) => w.import_receipts, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => Supplier, (s) => s.import_receipts, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  creator?: User | null;

  @OneToMany(() => ImportReceiptItem, (i) => i.receipt, { cascade: false })
  items: ImportReceiptItem[];
}
