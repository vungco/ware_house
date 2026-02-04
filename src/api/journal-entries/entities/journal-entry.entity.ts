import { Column, Entity, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { JournalEntryLine } from '../../journal-entry-lines/entities/journal-entry-line.entity';
import { User } from '../../users/entities/user.entity';

export enum JournalEntryStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  CANCELLED = 'CANCELLED',
}

@Entity('journal_entries')
export class JournalEntry extends BaseEntity {

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: JournalEntryStatus,
    default: JournalEntryStatus.DRAFT,
  })
  status: JournalEntryStatus;

  // ai tạo bút toán
  @ManyToOne(() => User)
  createdBy: User;

  // các dòng định khoản
  @OneToMany(() => JournalEntryLine, (line) => line.journalEntry, {
    cascade: true,
  })
  lines: JournalEntryLine[];
}
