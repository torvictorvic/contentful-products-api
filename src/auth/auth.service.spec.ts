import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('fake-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should validate user and return a JWT', async () => {
    const token = await service.login('admin', 'admin');
    expect(token.access_token).toBe('fake-jwt-token');
  });

  it('should throw UnauthorizedException for wrong credentials', async () => {
    await expect(service.login('wrong', 'creds')).rejects.toThrow();
  });
});
