import { Test } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';

const mockProducts: Product[] = [
    {
      id: '1',
      contentfulId: 'cf1',
      sku: 'SKU-1',
      name: 'Phone',
      category: 'Tech',
      brand: 'X',
      model: 'M1',
      color: 'Black',
      price: 200,
      currency: 'USD',
      stock: 10,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      contentfulId: 'cf2',
      sku: 'SKU-2',
      name: 'Laptop',
      category: 'Tech',
      brand: 'Y',
      model: 'M2',
      color: 'Gray',
      price: 800,
      currency: 'USD',
      stock: 5,
      isDeleted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  

describe('ProductsService', () => {
  let service: ProductsService;
  let repo: Repository<Product>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([[mockProducts[0]], 1]),
            findOne: jest.fn().mockResolvedValue(mockProducts[0]),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should paginate and filter products', async () => {
    const result = await service.paginateAndFilter({ page: 1 });
    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it('should soft delete a product', async () => {
    const saveSpy = jest.spyOn(repo, 'save').mockResolvedValue(mockProducts[0]);
    await service.softDelete('1');
    expect(saveSpy).toHaveBeenCalled();
  });
});
