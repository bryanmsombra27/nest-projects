import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './common/services/prisma/prisma.service';
import { RolesModule } from './roles/roles.module';
import { PersonalModule } from './personal/personal.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, RolesModule, PersonalModule, UserModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
