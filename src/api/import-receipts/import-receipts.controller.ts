import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ImportReceiptsService } from './import-receipts.service';
import { CreateImportReceiptDto } from './dto/create-import-receipt.dto';
import { UpdateImportReceiptDto } from './dto/update-import-receipt.dto';

@Controller('import-receipts')
export class ImportReceiptsController {
  constructor(private readonly importReceiptsService: ImportReceiptsService) {}

  @Post()
  create(@Body() createImportReceiptDto: CreateImportReceiptDto) {
    return this.importReceiptsService.create(createImportReceiptDto);
  }

  @Get()
  findAll() {
    return this.importReceiptsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.importReceiptsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImportReceiptDto: UpdateImportReceiptDto) {
    return this.importReceiptsService.update(+id, updateImportReceiptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.importReceiptsService.remove(+id);
  }
}
