// src/modules/users/application/create-user/create-user.service.ts

import { 
  Injectable, 
  Inject, 
  ConflictException, 
  ForbiddenException // <-- 1. AÑADIDO: Necesario para el error 403
} from '@nestjs/common';
import {
  UserDomain,
  UserRepository,
} from '../../domain/user.repository';
import { CreateUserDto } from '../../infrastructure/controllers/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserService {
  
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  // 2. MODIFICADO: Ahora recibe 'requestingUser' (quien hace la petición)
  public async execute(
    dto: CreateUserDto, 
    requestingUser: any
  ): Promise<UserDomain> {
    
    // --- 3. REGLA DE NEGOCIO (SEGURIDAD) ---
    // Si intentan crear un Administrador (idRol 1)
    if (dto.idRol === 1) {
      // Y quien lo pide NO es Administrador (su rol en el token no es 1)
      if (requestingUser.rol !== 1) {
        throw new ForbiddenException('No tienes permisos para crear administradores.');
      }
    }
    // ---------------------------------------

    const userExists = await this.userRepository.findByEmail(dto.email);

    if (userExists) {
      throw new ConflictException('El correo electronico ya esta en uso');
    }
    
    // hashear la contra
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    // prepara el objeto de dominio puro para guardar
    const newUserDomain = new UserDomain();

    newUserDomain.email = dto.email;
    newUserDomain.nombre = dto.nombre;
    newUserDomain.apellidoMaterno = dto.apellidoMaterno;
    newUserDomain.apellidoPaterno = dto.apellidoPaterno;
    newUserDomain.idRol = dto.idRol;
    newUserDomain.isActive = true;
    newUserDomain.whatsappNumber = dto.whatsappNumber;

    const userToSave = {
      ...newUserDomain,
      passwordHash: passwordHash,
    };
    
    return this.userRepository.save(userToSave);
  }
}