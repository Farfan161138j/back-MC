// src/modules/users/infrastructure/controllers/users.controller.ts

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  ParseIntPipe,
  Patch, // <-- 1. AÑADIDO
  Delete,
} from '@nestjs/common';
import { CreateUserService } from '../../application/create-user/create-user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetAllUsersService } from '../../application/get-all-users/get-all-users.service';
import { GetUserByIdService } from '../../application/get-user-by-id/get-user-by-id.service';
import { DeleteUserService } from '../../application/delete-user/delete-user.service';
// --- ¡AQUÍ ESTÁ LO NUEVO! ---
// 2. Importa el DTO de actualización
import { UpdateUserDto } from './dto/update-user.dto';
// 3. Importa el NUEVO "Cerebro" (aún no lo creamos)
import { UpdateUserService } from '../../application/update-user/update-user.service';
// --- FIN DE LO NUEVO ---

@Controller('users') // Define la ruta base: /users
export class UsersController {
  
  // 4. INYECTA EL NUEVO "CEREBRO" EN EL CONSTRUCTOR
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly getAllUsersService: GetAllUsersService,
    private readonly getUserByIdService: GetUserByIdService,
    private readonly updateUserService: UpdateUserService,
    private readonly deleteUserService: DeleteUserService, // <-- AÑADIDO
  ) {}

  
  /**
   * Ruta: POST /users
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.createUserService.execute(createUserDto);
    return user;
  }

  /**
   * Ruta: GET /users
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const users = await this.getAllUsersService.execute();
    return users;
  }

  /**
   * Ruta: GET /users/:id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = await this.getUserByIdService.execute(id);
    return user;
  }

  
  @Patch(':id') // 5. Define el método HTTP: PATCH
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto, // 5. Usa el nuevo DTO
  ) {
    // El "Cerebro" se encargará de toda la lógica
    const user = await this.updateUserService.execute(id, updateUserDto);
    return user;
  }
  // --- FIN DE LO NUEVO ---

  @Delete(':id') // 4. Define el método HTTP: DELETE
  @HttpCode(HttpStatus.NO_CONTENT) // Responde con un 204 (No Content) si todo sale bien
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ) {
    // El "Cerebro" se encargará de la lógica
    // (verificar si existe y luego borrar)
    await this.deleteUserService.execute(id);
    
    // En un DELETE exitoso, no se devuelve contenido (código 204)
    return;
  }
}