import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { ImportReceiptItem } from '../../import-receipts/entities/import-receipt-item.entity';
import { ExportReceiptItem } from '../../export-receipts/entities/export-receipt-item.entity';
import { StockAdjustment } from '../../stock-adjustments/entities/stock-adjustment.entity';

@Entity('materials')
export class Material extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 60 })
  code: string;

  @Column({ type: 'varchar', length: 180 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  unit: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string | null;

  @OneToMany(() => Inventory, (inv) => inv.material)
  inventories: Inventory[];

  @OneToMany(() => ImportReceiptItem, (i) => i.material)
  import_items: ImportReceiptItem[];

  @OneToMany(() => ExportReceiptItem, (i) => i.material)
  export_items: ExportReceiptItem[];

  @OneToMany(() => StockAdjustment, (a) => a.material)
  stock_adjustments: StockAdjustment[];
}
