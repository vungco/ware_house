import { Column, Entity, Index, ManyToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

export enum RoleName {
  THU_KHO = 'THU_KHO',
  KE_TOAN = 'KE_TOAN',
  QUAN_LY = 'QUAN_LY',
}

@Entity('roles')
export class Role extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50 })
  name: RoleName;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string | null;

  @ManyToMany(() => User, (u) => u.roles)
  users: User[];
}
