import { Test } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController (mock)', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            paginateAndFilter: jest.fn().mockResolvedValue({ items: [], total: 0 }),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should return empty list', async () => {
    const result = await controller.list({ page: 1 });
    expect(result.items).toEqual([]);
  });
});
