import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { SupabaseGuard } from 'src/guards/supabase.guard';
import { LoginDto } from 'src/common/dtos/loginDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(SupabaseGuard)
  @Get('user')
  getUser(@Request() req) {
    const user = req.user;
    return {
      message: 'Tus registros',
      userId: user.id, // UUID de Supabase
    };
  }

  @Post('register')
  createUSer(@Body() user: LoginDto) {
    return this.authService.createSupabaseUser(user);
  }
}
