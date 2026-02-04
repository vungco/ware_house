import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { AccountingEntryService } from './AccountingService';

@Module({
  imports: [TypeOrmModule.forFeature([Account]),AuditLogsModule],
  controllers: [AccountsController],
  providers: [AccountsService,AccountingEntryService],
  exports: [AccountsService,AccountingEntryService],
})
export class AccountsModule {}
