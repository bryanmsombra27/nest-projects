import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { FirebaseService } from 'src/common/services/firebase/firebase.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, FirebaseService],
  imports: [AuthModule],
})
export class UserModule {}
