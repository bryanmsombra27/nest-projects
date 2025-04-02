import { Module } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { PersonalController } from './personal.controller';
import { PrismaService } from '../common/services/prisma/prisma.service';

@Module({
  controllers: [PersonalController],
  providers: [PersonalService, PrismaService],
})
export class PersonalModule {}
