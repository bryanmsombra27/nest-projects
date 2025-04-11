import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/common/services/prisma/prisma.service';

@Module({
  controllers: [SeederController],
  providers: [SeederService, PrismaService],
})
export class SeederModule {}
