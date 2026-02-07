import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';
import { StocktakeItem } from './stock-item.entity';

export enum StocktakeStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  CANCELLED = 'CANCELLED',
}

@Entity('stocktakes')
export class Stocktake extends BaseEntity {
  @Index()
  @Column({ type: 'uuid' })
  warehouse_id: string;

  @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note?: string;

  @Column({ type: 'varchar', length: 20, default: StocktakeStatus.DRAFT })
  status: StocktakeStatus;

  @OneToMany(() => StocktakeItem, (i) => i.stocktake, { cascade: true })
  items: StocktakeItem[];
}
