import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  async login(username: string, password: string) {
    if (username !== 'admin' || password !== 'admin') {
      throw new UnauthorizedException();
    }
    return { access_token: await this.jwt.signAsync({ sub: 'admin', role: 'admin' }) };
  }
}
