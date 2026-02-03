import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { DecimalTransformer } from '../../../common/transformers/decimal.transformer';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';
import { Material } from '../../materials/entities/material.entity';
import { User } from '../../users/entities/user.entity';

export enum AdjustmentType {
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE',
}

@Entity('stock_adjustments')
export class StockAdjustment extends BaseEntity {
  @Index()
  @Column({ type: 'uuid' })
  warehouse_id: string;

  @Index()
  @Column({ type: 'uuid' })
  material_id: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  created_by?: string | null;

  @Column({ type: 'varchar', length: 20 })
  type: AdjustmentType;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 3,
    transformer: new DecimalTransformer(),
  })
  quantity: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reason?: string | null;

  @ManyToOne(() => Warehouse, (w) => w.stock_adjustments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => Material, (m) => m.stock_adjustments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'material_id' })
  material: Material;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  creator: User;
}
