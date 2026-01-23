import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { DecimalTransformer } from '../../common/transformers/decimal.transformer';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';
import { Material } from '../../materials/entities/material.entity';

@Entity('inventories')
@Unique('UQ_inventory_warehouse_material', ['warehouse_id', 'material_id'])
export class Inventory extends BaseEntity {
  @Index()
  @Column({ type: 'uuid' })
  warehouse_id: string;

  @Index()
  @Column({ type: 'uuid' })
  material_id: string;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 3,
    default: 0,
    transformer: new DecimalTransformer(),
  })
  quantity: number;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 3,
    default: 0,
    transformer: new DecimalTransformer(),
  })
  min_quantity: number;

  @ManyToOne(() => Warehouse, (w) => w.inventories, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => Material, (m) => m.inventories, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'material_id' })
  material: Material;
}
