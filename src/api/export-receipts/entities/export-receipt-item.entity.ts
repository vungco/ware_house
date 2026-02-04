import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { DecimalTransformer } from '../../../common/transformers/decimal.transformer';
import { ExportReceipt } from './export-receipt.entity';
import { Material } from '../../materials/entities/material.entity';

@Entity('export_receipt_items')
export class ExportReceiptItem extends BaseEntity {
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

    @ManyToOne(() => ExportReceipt, (r) => r.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'receipt_id' })
    receipt: ExportReceipt;

    @ManyToOne(() => Material, (m) => m.export_items, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'material_id' })
    material: Material;
}
