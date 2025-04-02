import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './common/services/prisma/prisma.service';
import { RolesModule } from './roles/roles.module';
import { PersonalModule } from './personal/personal.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      // global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10h' },
    }),
    AuthModule,
    RolesModule,
    PersonalModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
