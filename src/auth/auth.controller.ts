import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private svc: AuthService) {}
  @Post('login') login(@Body() body: { username: string; password: string }) {
    return this.svc.login(body.username, body.password);
  }
}
