import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum AuditAction {
    // ===== CRUD =====
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',

    // ===== RECEIPT =====
    APPROVE = 'APPROVE',
    REJECT = 'REJECT',
    CANCEL = 'CANCEL',

    // ===== INVENTORY =====
    STOCK_INCREASE = 'STOCK_INCREASE',
    STOCK_DECREASE = 'STOCK_DECREASE',
    STOCK_ADJUST = 'STOCK_ADJUST',

    // ===== USER / ROLE =====
    ASSIGN_ROLE = 'ASSIGN_ROLE',
    REMOVE_ROLE = 'REMOVE_ROLE',
    CHANGE_STATUS = 'CHANGE_STATUS',

    // ===== SYSTEM =====
    EXPORT = 'EXPORT',
    IMPORT = 'IMPORT',
}

@Entity('audit_logs')
export class AuditLog extends BaseEntity {
    @Index()
    @Column({ type: 'uuid', nullable: true })
    user_id?: string | null;

    @Column({
        type: 'enum',
        enum: AuditAction,
    })
    action: AuditAction;

    @Column({ type: 'varchar', length: 80 })
    entity_name: string;

    @Index()
    @Column({ type: 'uuid', nullable: true })
    entity_id?: string | null;

    @Column({ type: 'jsonb', nullable: true })
    old_value?: any;

    @Column({ type: 'jsonb', nullable: true })
    new_value?: any;

    @Column({ type: 'varchar', length: 60, nullable: true })
    ip?: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    user_agent?: string | null;

    @ManyToOne(() => User, (u) => u.audit_logs, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user?: User | null;
}
