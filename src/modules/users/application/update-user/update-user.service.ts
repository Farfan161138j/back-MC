// src/modules/users/application/update-user/update-user.service.ts

import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  ForbiddenException, // <--- 1. NUEVO IMPORT
} from '@nestjs/common';
import {
  UserDomain,
  UserRepository,
} from '../../domain/user.repository';
import { UpdateUserDto } from '../../infrastructure/controllers/dto/update-user.dto';
import { RoleEnum } from '../../domain/roles.enum'; // <--- 2. NUEVO IMPORT
import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdateUserService {
  
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(
    id: number,
    updateUserDto: UpdateUserDto,
    requestingUser: any, // <--- 3. PARAMETRO NUEVO
  ): Promise<UserDomain> {
    
    // --- 🛡️ 4. BLOQUE DE SEGURIDAD NUEVO ---
    const isAdmin = requestingUser.rol === RoleEnum.ADMIN;
    const isOwner = requestingUser.id === id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('No puedes modificar el perfil de otro usuario.');
    }
    // ---------------------------------------

    // 1. Buscamos el usuario por ID
    const userToUpdate = await this.userRepository.findById(id);

    if (!userToUpdate) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    // 2. Verificamos email duplicado (si cambió)
    if (updateUserDto.email && updateUserDto.email !== userToUpdate.email) {
      const existingUserByEmail = await this.userRepository.findByEmail(
        updateUserDto.email,
      );
      if (existingUserByEmail) {
        throw new ConflictException('El correo electrónico ya está en uso');
      }
    }

    // 3. Hasheamos password (si cambió)
    let hashedPassword: string | undefined;
    if (updateUserDto.password) {
      hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    }

    // 4. Mezclamos los datos
    const updatedUser = Object.assign(userToUpdate, {
      ...updateUserDto,
      passwordHash: hashedPassword, // Si es undefined, Object.assign suele ignorarlo o ponerlo undefined, cuidaremos eso en la persistencia.
    });
    
    // Nota: Si hashedPassword es undefined, asegúrate de que tu lógica de guardado no borre el hash anterior. 
    // En tu código actual, si Object.assign recibe undefined, la propiedad queda undefined. 
    // TypeORM suele ser inteligente, pero una forma más segura es:
    if (hashedPassword) {
        updatedUser.passwordHash = hashedPassword;
    }

    return this.userRepository.save(updatedUser);
  }
}