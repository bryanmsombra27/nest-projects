import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProvidersModule } from 'src/providers/providers.module';
import { WarehouseModule } from 'src/warehouse/warehouse.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Product]),
    ProvidersModule,
    WarehouseModule,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
