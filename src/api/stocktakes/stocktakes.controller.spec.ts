import { Test, TestingModule } from '@nestjs/testing';
import { StocktakesController } from './stocktakes.controller';
import { StocktakesService } from './stocktakes.service';

describe('StocktakesController', () => {
  let controller: StocktakesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StocktakesController],
      providers: [StocktakesService],
    }).compile();

    controller = module.get<StocktakesController>(StocktakesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
