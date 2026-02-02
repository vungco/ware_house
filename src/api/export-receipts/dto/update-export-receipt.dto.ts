import { PartialType } from '@nestjs/swagger';
import { CreateExportReceiptDto } from './create-export-receipt.dto';

export class UpdateExportReceiptDto extends PartialType(CreateExportReceiptDto) {}
