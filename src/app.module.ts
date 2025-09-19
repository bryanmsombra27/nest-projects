import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ZonesModule } from './zones/zones.module';
import { PrismaService } from './services/prisma/prisma.service';
import { LocationModule } from './location/location.module';
import { SupabaseService } from './services/supabase/supabase.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // <-- donde está tu index.html
    }),

    JwtModule.register({
      // global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10h' },
    }),
    AuthModule,
    ZonesModule,
    LocationModule,
  ],
  controllers: [],
  providers: [PrismaService, SupabaseService],
})
export class AppModule {}
