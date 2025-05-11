import { Module } from '@nestjs/common';
import { SubmodulosService } from './submodulos.service';
import { SubmodulosController } from './submodulos.controller';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SubmodulosController],
  providers: [SubmodulosService, PrismaService],
  imports: [AuthModule],
})
export class SubmodulosModule {}
