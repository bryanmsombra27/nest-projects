import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SupabaseGuard } from 'src/guards/supabase.guard';
import { LoginDto } from 'src/common/dtos/loginDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(SupabaseGuard)
  @Get('user')
  getUser(@Request() req) {
    const user = req.user;
    return {
      message: 'Usuario actual',
      userId: user.id, // UUID de Supabase
    };
  }

  @Post('register')
  createUSer(@Body() user: LoginDto) {
    return this.authService.createSupabaseUser(user);
  }
  @Post('login')
  login(@Body() user: LoginDto) {
    return this.authService.login(user);
  }
  @Post('logout')
  logout() {
    return this.authService.logout();
  }
}
