import { Module } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Order } from '../order/entities/order.entity';
import { OrderModule } from '../order/order.module';
import { Product } from '../products/entities/product.entity';

@Module({
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([OrderItem, Order, Product]),
    OrderModule,
  ],
})
export class OrderItemsModule {}
