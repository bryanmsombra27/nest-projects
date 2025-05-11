import { Module } from '@nestjs/common';
import { ModulosService } from './modulos.service';
import { ModulosController } from './modulos.controller';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ModulosController],
  providers: [ModulosService, PrismaService],
  imports: [AuthModule],
})
export class ModulosModule {}
