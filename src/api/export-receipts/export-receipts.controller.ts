import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExportReceiptsService } from './export-receipts.service';
import { CreateExportReceiptDto } from './dto/create-export-receipt.dto';
import { UpdateExportReceiptDto } from './dto/update-export-receipt.dto';

@Controller('export-receipts')
export class ExportReceiptsController {
  constructor(private readonly exportReceiptsService: ExportReceiptsService) {}

  @Post()
  create(@Body() createExportReceiptDto: CreateExportReceiptDto) {
    return this.exportReceiptsService.create(createExportReceiptDto);
  }

  @Get()
  findAll() {
    return this.exportReceiptsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exportReceiptsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExportReceiptDto: UpdateExportReceiptDto) {
    return this.exportReceiptsService.update(+id, updateExportReceiptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exportReceiptsService.remove(+id);
  }
}
