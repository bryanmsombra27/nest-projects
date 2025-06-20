import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { QrudGateway } from 'src/socket-server/qrud.gateway';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, PrismaService, QrudGateway],
  imports: [AuthModule],
})
export class PermissionsModule {}
