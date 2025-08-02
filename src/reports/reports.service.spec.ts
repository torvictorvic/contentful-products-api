import { Test } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../products/product.entity';
import { Repository } from 'typeorm';

describe('ReportsService', () => {
  let service: ReportsService;
  let repo: Repository<Product>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            count: jest.fn().mockImplementation((where) =>
              where?.where?.isDeleted === true ? 1 : 5
            ),
            createQueryBuilder: jest.fn(() => ({
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              groupBy: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getRawMany: jest.fn().mockResolvedValue([{ category: 'Tech', count: 3 }]),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    repo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should calculate deleted percentage', async () => {
    const res = await service.percentageDeleted();
    expect(res.percentage).toBeGreaterThan(0);
  });

  it('should calculate non-deleted percentage with price', async () => {
    const res = await service.percentageNonDeletedWithPrice({ withPrice: true });
    expect(res.percentage).toBeGreaterThan(0);
  });

  it('should return top categories', async () => {
    const res = await service.topCategories();
    expect(res[0].category).toBe('Tech');
  });
});
