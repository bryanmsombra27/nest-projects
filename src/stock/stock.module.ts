import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [StockController],
  providers: [StockService],
  imports: [TypeOrmModule.forFeature([Stock]), AuthModule, ProductsModule],
})
export class StockModule {}
