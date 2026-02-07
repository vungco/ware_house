import { Test, TestingModule } from '@nestjs/testing';
import { StocktakesService } from './stocktakes.service';

describe('StocktakesService', () => {
  let service: StocktakesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StocktakesService],
    }).compile();

    service = module.get<StocktakesService>(StocktakesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
