import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { ProvidersModule } from './providers/providers.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      // global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10h' },
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    WarehouseModule,
    ProvidersModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [],
})
export class AppModule {}
