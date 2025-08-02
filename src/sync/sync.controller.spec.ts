import { Test } from '@nestjs/testing';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';

describe('SyncController (mock)', () => {
  let controller: SyncController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [SyncController],
      providers: [
        {
          provide: SyncService,
          useValue: {
            trigger: jest.fn().mockResolvedValue({ upserts: 5 }),
          },
        },
      ],
    }).compile();

    controller = module.get<SyncController>(SyncController);
  });

  it('should trigger sync and return upserts count', async () => {
    const res = await controller.trigger();
    expect(res.upserts).toBe(5); 
  });
});
