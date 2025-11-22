import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi'
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
@Module({
//manera global y configuracion requerida
 imports: [
  ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),

        PORT: Joi.number().default(3000),
    }),
  }),
  DatabaseModule,
  UsersModule,
  AuthModule,
  ProductsModule,
 ],
 controllers: [],
  providers: [],   
})
export class AppModule {}
