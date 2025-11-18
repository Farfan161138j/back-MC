import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  Request,   // <-- Importante para leer el usuario del token
  UseGuards, // <-- Importante para activar el guard
} from '@nestjs/common';
import { CreateUserService } from '../../application/create-user/create-user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetAllUsersService } from '../../application/get-all-users/get-all-users.service';
import { GetUserByIdService } from '../../application/get-user-by-id/get-user-by-id.service';
import { DeleteUserService } from '../../application/delete-user/delete-user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserService } from '../../application/update-user/update-user.service';

// 1. IMPORTA EL GUARDIA DE SEGURIDAD
// (Asegúrate que la ruta relativa sea correcta según tu estructura)
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard) // 2. PROTEGE TODAS LAS RUTAS (El "Candado Maestro")
export class UsersController {
  
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly getAllUsersService: GetAllUsersService,
    private readonly getUserByIdService: GetUserByIdService,
    private readonly updateUserService: UpdateUserService,
    private readonly deleteUserService: DeleteUserService,
  ) {}

  /**
   * Ruta: POST /users
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createUserDto: CreateUserDto,
    @Request() req, // 3. INYECTAMOS LA PETICIÓN (Request)
  ) {
    // Extraemos el usuario que está en el Token (el que hace la petición)
    const requestingUser = req.user;

    // Pasamos AMBOS datos al Cerebro:
    // 1. El DTO (datos del nuevo usuario)
    // 2. requestingUser (quién está ordenando la creación)
    const user = await this.createUserService.execute(createUserDto, requestingUser);
    
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
  
  /**
   * Ruta: PATCH /users/:id
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.updateUserService.execute(id, updateUserDto);
    return user;
  }

  /**
   * Ruta: DELETE /users/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Request() req, // <--- 1. Recibimos la petición
  ) {
    const requestingUser = req.user; // <--- 2. Extraemos quién es el usuario

    // 3. Se lo pasamos al "Cerebro"
    await this.deleteUserService.execute(id, requestingUser);
    
    return;
  }
}