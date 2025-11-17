// src/modules/users/application/update-user/update-user.service.ts

import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  UserDomain,
  UserRepository,
} from '../../domain/user.repository';
import { UpdateUserDto } from '../../infrastructure/controllers/dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdateUserService {
  
  // 1. Inyectamos el "Contrato" (UserRepository)
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Este es el "Caso de Uso" para actualizar un usuario.
   * @param id El ID del usuario a actualizar.
   * @param updateUserDto Los datos a actualizar.
   */
  public async execute(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDomain> {
    
    // 1. Buscamos el usuario por ID (¡Reutilizamos el 'findById'!)
    const userToUpdate = await this.userRepository.findById(id);

    // 2. Si no existe, lanzamos un error 404
    if (!userToUpdate) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    // 3. Verificamos si el email se va a cambiar Y si ya existe
    if (updateUserDto.email && updateUserDto.email !== userToUpdate.email) {
      const existingUserByEmail = await this.userRepository.findByEmail(
        updateUserDto.email,
      );
      // Si existe otro usuario con ese email, lanzamos error 409
      if (existingUserByEmail) {
        throw new ConflictException('El correo electrónico ya está en uso');
      }
    }

    // 4. Verificamos si la contraseña se va a cambiar
    let hashedPassword: string | undefined;
    if (updateUserDto.password) {
      // Hasheamos la nueva contraseña
      hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    }

    // 5. Mezclamos los datos
    // 'Object.assign' toma el objeto original (userToUpdate)
    // y le "encima" los campos del DTO.
    const updatedUser = Object.assign(userToUpdate, {
      ...updateUserDto,
      // Si hasheamos un password, lo usamos. Si no, usamos 'undefined'
      // (lo que 'Object.assign' ignora, dejando el password anterior)
      passwordHash: hashedPassword, 
    });

    // 6. Guardamos el usuario actualizado
    // (¡Reutilizamos el 'save'!)
    // El 'save' recibe el objeto con 'passwordHash' y lo guarda.
    return this.userRepository.save(updatedUser);
  }
}