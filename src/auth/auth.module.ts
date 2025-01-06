import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],

  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],

    //   useFactory: (configService: ConfigService) => {
    //   // useFactory: () => {
    //     return {
    //       // secret: process.env.JWT_SECRET,
    //       secret: configService.get('JWT_SECRET'),
    //       signOptions: {
    //         expiresIn: '2h',
    //       },
    //     };
    //   },
    // }),

    JwtModule.register({
      secret: process.env.JWT_SECRET,

      // secretOrPrivateKey
      signOptions: {
        expiresIn: '2h',
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
