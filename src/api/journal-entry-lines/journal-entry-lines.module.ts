import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JournalEntryLine } from "./entities/journal-entry-line.entity";
import { AccountsModule } from "../accounts/accounts.module";
import { JournalEntryLinesService } from "./journal-entry-lines.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([JournalEntryLine]),
    AccountsModule,
  ],
  providers: [JournalEntryLinesService],
  exports: [JournalEntryLinesService],
})
export class JournalEntryLinesModule {}
