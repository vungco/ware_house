import { Injectable } from '@nestjs/common';
import { CreateStockAdjustmentDto } from './dto/create-stock-adjustment.dto';
import { UpdateStockAdjustmentDto } from './dto/update-stock-adjustment.dto';

@Injectable()
export class StockAdjustmentsService {
  create(createStockAdjustmentDto: CreateStockAdjustmentDto) {
    return 'This action adds a new stockAdjustment';
  }

  findAll() {
    return `This action returns all stockAdjustments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stockAdjustment`;
  }

  update(id: number, updateStockAdjustmentDto: UpdateStockAdjustmentDto) {
    return `This action updates a #${id} stockAdjustment`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockAdjustment`;
  }
}
