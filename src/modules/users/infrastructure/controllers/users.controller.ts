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
  Request,   
  UseGuards, 
} from '@nestjs/common';
import { CreateUserService } from '../../application/create-user/create-user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetAllUsersService } from '../../application/get-all-users/get-all-users.service';
import { GetUserByIdService } from '../../application/get-user-by-id/get-user-by-id.service';
import { DeleteUserService } from '../../application/delete-user/delete-user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserService } from '../../application/update-user/update-user.service';

// IMPORTS DE SEGURIDAD
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { RoleEnum } from '../../domain/roles.enum';

@Controller('users')
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
  // Nota: No ponemos @Roles(ADMIN) aquí porque tu servicio ya valida internamente
  // si alguien normal intenta crear un admin.
  async create(
    @Body() createUserDto: CreateUserDto,
    @Request() req, 
  ) {
    // CORRECCIÓN: Pasamos req.user porque tu servicio lo necesita para validar roles
    return this.createUserService.execute(createUserDto, req.user);
  }

  /**
   * Ruta: GET /users
   * Solo Admin
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.ADMIN) 
  async findAll() {
    return this.getAllUsersService.execute();
  }

  /**
   * Ruta: GET /users/:id
   * Valida propiedad
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req, 
  ) {
    return this.getUserByIdService.execute(id, req.user);
  }
  
  /**
   * Ruta: PATCH /users/:id
   * Valida propiedad
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req, 
  ) {
    return this.updateUserService.execute(id, updateUserDto, req.user);
  }

  /**
   * Ruta: DELETE /users/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // Quitamos @Roles(ADMIN) aquí para dejar que TU SERVICIO haga la validación avanzada
  // (La de "no borrar al último admin" y "usuario no borra admin").
  // Si dejamos @Roles(ADMIN), un usuario normal ni siquiera llegaría a tu lógica de servicio.
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    // CORRECCIÓN: Pasamos req.user porque tu servicio lo necesita para la "Regla de Supervivencia"
    await this.deleteUserService.execute(id, req.user);
    return;
  }
}