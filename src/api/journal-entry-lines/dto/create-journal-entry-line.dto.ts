import { IsUUID, IsNumber, Min } from 'class-validator';

export class CreateJournalEntryLineDto {
  @IsUUID()
  account_id: string;

  @IsNumber()
  @Min(0)
  debit: number;

  @IsNumber()
  @Min(0)
  credit: number;
}
