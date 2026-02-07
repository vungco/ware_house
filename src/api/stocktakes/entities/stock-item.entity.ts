import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Stocktake } from './stocktake.entity';
import { Material } from '../../materials/entities/material.entity';
import { Inventory } from '../../inventories/entities/inventory.entity';
import { DecimalTransformer } from '../../../common/transformers/decimal.transformer';

@Entity('stocktake_items')
export class StocktakeItem extends BaseEntity {
  @Index()
  @Column({ type: 'uuid' })
  stocktake_id: string;

  @ManyToOne(() => Stocktake, (s) => s.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stocktake_id' })
  stocktake: Stocktake;

  @Index()
  @Column({ type: 'uuid' })
  material_id: string;

  @ManyToOne(() => Material, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'material_id' })
  material: Material;

  // snapshot tồn hệ thống lúc kiểm kê
  @Column({
    type: 'numeric',
    precision: 18,
    scale: 3,
    transformer: new DecimalTransformer(),
  })
  system_quantity: number;

  // số đếm thực tế
  @Column({
    type: 'numeric',
    precision: 18,
    scale: 3,
    transformer: new DecimalTransformer(),
  })
  actual_quantity: number;

  // chênh lệch
  @Column({
    type: 'numeric',
    precision: 18,
    scale: 3,
    transformer: new DecimalTransformer(),
  })
  difference: number;

  // optional: link inventory snapshot
  @Column({ type: 'uuid', nullable: true })
  inventory_id?: string;

  @ManyToOne(() => Inventory, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'inventory_id' })
  inventory?: Inventory;
}
