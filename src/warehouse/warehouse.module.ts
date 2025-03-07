import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';

@Module({
  controllers: [WarehouseController],
  providers: [WarehouseService],
  imports: [AuthModule, TypeOrmModule.forFeature([Warehouse])],
  exports: [WarehouseService],
})
export class WarehouseModule {}
