import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PrismaService } from '../services/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [RolesController],
  providers: [RolesService, PrismaService],
  imports: [AuthModule],
})
export class RolesModule {}
