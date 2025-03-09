import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../services/prisma.service';

@Module({
  controllers: [ProvidersController],
  providers: [ProvidersService, PrismaService],
  imports: [AuthModule],
})
export class ProvidersModule {}
