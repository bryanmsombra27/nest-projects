import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SupabaseService } from 'src/services/supabase/supabase.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SupabaseService],
  imports: [ConfigModule.forRoot(), JwtModule],
  exports: [AuthService],
})
export class AuthModule {}
