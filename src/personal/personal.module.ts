import { Module } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { PersonalController } from './personal.controller';
import { PrismaService } from '../common/services/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PersonalController],
  providers: [PersonalService, PrismaService],
  imports: [AuthModule],
})
export class PersonalModule {}
