import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { DecimalTransformer } from '../../../common/transformers/decimal.transformer';
import { ImportReceipt } from './import-receipt.entity';
import { Material } from '../../materials/entities/material.entity';

@Entity('import_receipt_items')
export class ImportReceiptItem extends BaseEntity {
  @Index()
  @Column({ type: 'uuid' })
  receipt_id: string;

  @Index()
  @Column({ type: 'uuid' })
  material_id: string;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 3,
    transformer: new DecimalTransformer(),
  })
  quantity: number;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 2,
    default: 0,
    transformer: new DecimalTransformer(),
  })
  price: number;

  @ManyToOne(() => ImportReceipt, (r) => r.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receipt_id' })
  receipt: ImportReceipt;

  @ManyToOne(() => Material, (m) => m.import_items, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'material_id' })
  material: Material;
}
