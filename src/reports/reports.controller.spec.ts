import { Test } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { APP_GUARD } from '@nestjs/core';

describe('ReportsController', () => {
  let controller: ReportsController;
  let svc: ReportsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: {
            percentageDeleted: jest.fn().mockResolvedValue({ percentage: 10 }),
            percentageNonDeletedWithPrice: jest.fn().mockResolvedValue({ percentage: 90 }),
            topCategories: jest.fn().mockResolvedValue([{ category: 'Tech', count: 5 }]),
          },
        },
        // 
        { provide: APP_GUARD, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    svc = module.get<ReportsService>(ReportsService);
  });

  it('should return percentage of deleted products', async () => {
    const result = await controller.deleted();
    expect(result).toEqual({ percentage: 10 });
    expect(svc.percentageDeleted).toHaveBeenCalled();
  });

  it('should return percentage of non-deleted products', async () => {
    const result = await controller.nonDeleted('true', '2025-01-01', '2025-01-31');
    expect(result).toEqual({ percentage: 90 });
    expect(svc.percentageNonDeletedWithPrice).toHaveBeenCalledWith({
      withPrice: true,
      start: '2025-01-01',
      end: '2025-01-31',
    });
  });

  it('should return top categories', async () => {
    const result = await controller.top();
    expect(result).toEqual([{ category: 'Tech', count: 5 }]);
    expect(svc.topCategories).toHaveBeenCalled();
  });
});
