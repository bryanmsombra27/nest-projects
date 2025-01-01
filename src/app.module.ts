import { Module } from '@nestjs/common';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/app.config';
import { joiValidationSchema } from './config/joi.validation';

@Module({
  imports: [
    //  SI SE REALIZA LA CONFIGURACION DE LAS VARIABLES DE ENTORNO MEDIANTE LA CARGA DE UN ARCHIVO CENTRALIZADO LAS VARIABLES SOLO ESTARAN DISPONBILES Y ACCESIBLES CUANDO SE LLAME EL METODO "get"  DEL SERVICIO DE ConfigService provisto por el paquete de @nestjs/config
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: joiValidationSchema,
    }),
    // PERMITE SERVIR CONTENIDO ESTATICO PARA EL BACKEND (SERVIR CARPETAS )
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    // conexion a la db
    MongooseModule.forRoot(process.env.MONGODB, {
      appName: 'PokemonsDB',
    }),

    PokemonModule,

    CommonModule,

    SeedModule,
  ],
})
export class AppModule {
  constructor() {
    console.log(process.env.MONGODB, 'URI DE MONGO');
  }
}
