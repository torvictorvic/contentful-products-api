import { Test } from '@nestjs/testing';
import { ContentfulService } from './contentful.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../products/product.entity';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ContentfulService', () => {
  let service: ContentfulService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ContentfulService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('dummy'),
          },
        },
        {
          provide: getRepositoryToken(Product),
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
            save: jest.fn(),
            create: jest.fn().mockImplementation((x) => x),
          },
        },
      ],
    }).compile();

    service = module.get<ContentfulService>(ContentfulService);
  });

  it('should fetch entries from Contentful API', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { items: [{ sys: { id: '1' }, fields: { name: 'Test' } }] },
    });

    const entries = await service.fetchEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].sys.id).toBe('1');
  });
});
