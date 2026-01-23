import { PartialType } from '@nestjs/mapped-types';
import { CreateExportReceiptDto } from './create-export-receipt.dto';

export class UpdateExportReceiptDto extends PartialType(CreateExportReceiptDto) {}
