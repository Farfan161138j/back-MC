import { ConfigModule,ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
    imports:[
        /*configuracion de typeorm asincrona para trabajar con objetos es un traductor
        para que desde ts escriba todo y no tenga que escribir sql directamente*/

        TypeOrmModule.forRootAsync({
              imports:[ConfigModule], //importar configmodule para inyectar configservice
              inject:[ConfigService], //inyectar el config service

              /*contruccion de la configuracion de la bd, es una funcion que espera
              que el configservice este listo*/
              useFactory:(ConfigService:ConfigService) => ({
                type: 'postgres',
                host: ConfigService.getOrThrow<string>('DB_HOST'),
                port: ConfigService.getOrThrow<number>('DB_PORT'),
                username: ConfigService.getOrThrow<string>('DB_USERNAME'),
                password: ConfigService.getOrThrow<string>('DB_PASSWORD'),
                database: ConfigService.getOrThrow<string>('DB_NAME'),

                // para cargar automaticamnete las entidades
                autoLoadEntities: true,
                // borrar al llegar a produccion
                synchronize:true,
              }),
        }),
      
    ],
})
export class DatabaseModule{}