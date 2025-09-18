import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SuapabaseService } from 'src/services/suapabase/suapabase.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SuapabaseService],
  imports: [ConfigModule.forRoot(), JwtModule],
  exports: [AuthService],
})
export class AuthModule {}
