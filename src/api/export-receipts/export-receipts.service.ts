import { Injectable } from '@nestjs/common';
import { CreateExportReceiptDto } from './dto/create-export-receipt.dto';
import { UpdateExportReceiptDto } from './dto/update-export-receipt.dto';

@Injectable()
export class ExportReceiptsService {
  create(createExportReceiptDto: CreateExportReceiptDto) {
    return 'This action adds a new exportReceipt';
  }

  findAll() {
    return `This action returns all exportReceipts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exportReceipt`;
  }

  update(id: number, updateExportReceiptDto: UpdateExportReceiptDto) {
    return `This action updates a #${id} exportReceipt`;
  }

  remove(id: number) {
    return `This action removes a #${id} exportReceipt`;
  }
}
