import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../services/prisma.service';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  imports: [AuthModule, OrdersModule],
})
export class ProductsModule {}
