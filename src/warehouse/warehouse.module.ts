import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  controllers: [WarehouseController],
  providers: [WarehouseService, PrismaService],
  imports: [AuthModule],
})
export class WarehouseModule {}
