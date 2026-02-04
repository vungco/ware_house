import { Type } from 'class-transformer';
import { ValidateNested, ArrayMinSize } from 'class-validator';
import { CreateJournalEntryLineDto } from 'src/api/journal-entry-lines/dto/create-journal-entry-line.dto';

export class CreateJournalEntryDto {

  code: string;

  date: Date;

  description?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateJournalEntryLineDto)
  @ArrayMinSize(2)
  lines: CreateJournalEntryLineDto[];
}
