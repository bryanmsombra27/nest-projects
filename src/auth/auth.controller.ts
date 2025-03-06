import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService, Credentials } from './auth.service';
import { AuthguardGuard } from '../guards/authguard.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(@Body() signInDto: Credentials) {
    const token = await this.authService.signIn(signInDto);

    return { token };
  }

  @UseGuards(AuthguardGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
