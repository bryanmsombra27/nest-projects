import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { SupabaseService } from 'src/services/supabase/supabase.service';

@Module({
  controllers: [RatingsController],
  providers: [RatingsService, PrismaService, SupabaseService],
  imports: [AuthModule],
})
export class RatingsModule {}
