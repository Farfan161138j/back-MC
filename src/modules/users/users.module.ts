// src/modules/users/users.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// --- Capa de Dominio ---
import { UserRepository } from './domain/user.repository';

// --- Capa de Aplicación ---
import { CreateUserService } from './application/create-user/create-user.service';
// 1. IMPORTA EL NUEVO "CEREBRO"
import { GetAllUsersService } from './application/get-all-users/get-all-users.service';
import { GetUserByIdService } from './application/get-user-by-id/get-user-by-id.service';
import { UpdateUserService } from './application/update-user/update-user.service';
import { DeleteUserService } from './application/delete-user/delete-user.service';
// --- Capa de Infraestructura ---
import { UsersController } from './infrastructure/controllers/users.controller';
import { User } from './infrastructure/entities/user.entity';
import { Rol } from './infrastructure/entities/rol.entity';
import { TypeOrmUserRepository } from './infrastructure/persistence/user.repository';

import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Rol]),
  ],
  controllers: [
    UsersController,
  ],
  providers: [
    // 3. Registra AMBOS "Cerebros"
    CreateUserService,
    GetAllUsersService, // <-- 2. AÑADE ESTA LÍNEA
    GetUserByIdService,
    UpdateUserService,
    DeleteUserService, // <-- Añade esta línea


    UsersService,
    // 4. El "Pegamento" (se queda igual)
    {
      provide: UserRepository,
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [UsersService,UserRepository],
})
export class UsersModule {}