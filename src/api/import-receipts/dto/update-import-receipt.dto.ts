import { PartialType } from '@nestjs/mapped-types';
import { CreateImportReceiptDto } from './create-import-receipt.dto';

export class UpdateImportReceiptDto extends PartialType(CreateImportReceiptDto) {}
