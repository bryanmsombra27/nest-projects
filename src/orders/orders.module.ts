import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../services/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService],
  imports: [AuthModule],
})
export class OrdersModule {}
