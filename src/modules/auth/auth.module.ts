// src/modules/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// 1. Importamos el "vecindario" de Users
import { UsersModule } from '../users/users.module';
import { LoginService } from './application/login/login.service';
// (Pronto importaremos el Controller y el Service de aquí)
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy'; // <-- IMPÓRTALO

import { AuthController } from './infrastructure/controllers/auth.controller';
@Module({
  imports: [
    // 2. Importamos el UsersModule
    // para que este módulo pueda usar el "Gerente" (UsersService)
    UsersModule,
    

    // 3. Configuramos el Módulo JWT
    JwtModule.registerAsync({
      imports: [ConfigModule], // Usamos ConfigModule para las variables .env
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // ¡La clave secreta! La tomamos del .env
        secret: configService.get<string>('JWT_SECRET'),
        // Tiempo de vida del token (ej. 1 hora)
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [
    AuthController
  ],
  providers: [
    LoginService,
    JwtStrategy,
  
  ],
})
export class AuthModule {}