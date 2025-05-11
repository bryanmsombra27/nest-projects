import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './common/services/prisma/prisma.service';
import { RolesModule } from './roles/roles.module';
import { PersonalModule } from './personal/personal.module';
import { UserModule } from './user/user.module';
import { SeederModule } from './seeder/seeder.module';
import { ModulosModule } from './modulos/modulos.module';
import { SubmodulosModule } from './submodulos/submodulos.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    RolesModule,
    PersonalModule,
    UserModule,
    SeederModule,
    ModulosModule,
    SubmodulosModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
