// src/modules/users/application/create-user/create-user.service.ts

// Imports corregidos y limpiados
import { Injectable, Inject, ConflictException } from '@nestjs/common';
import {
  UserDomain,
  UserRepository,
} from '../../domain/user.repository';
import { CreateUserDto } from '../../infrastructure/controllers/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable() // <-- 1. Error crítico: Faltaba @Injectable()
export class CreateUserService {
  
  // 2. Error crítico: Sintaxis de inyección corregida
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository, // <-- 'UserRepository' es el TIPO
  ) {}

  public async execute(dto: CreateUserDto): Promise<UserDomain> {
    
    const userExists = await this.userRepository.findByEmail(dto.email);

    if (userExists) {
      throw new ConflictException('El correo electronico ya esta en uso');
    }
    
    // hashear la contra
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    // prepara el objeto de dominio puro para guardar
    const newUserDomain = new UserDomain(); // <-- 3. Error crítico: Faltaba 'new'

    // 4. Error crítico: Nombres de propiedad corregidos a camelCase
    newUserDomain.email = dto.email;
    newUserDomain.nombre = dto.nombre;
    newUserDomain.apellidoMaterno = dto.apellidoMaterno; // Corregido
    newUserDomain.apellidoPaterno = dto.apellidoPaterno; // Corregido
    newUserDomain.idRol = dto.idRol; // Corregido (en UserDomain es idRol)
    newUserDomain.isActive = true;

    // 5. Corregido: Variable a minúscula
    const userToSave = {
      ...newUserDomain,
      passwordHash: passwordHash,
    };
    
    // Esta lógica es CORRECTA.
    // El "Cerebro" le pasa el hash al "Contrato".
    return this.userRepository.save(userToSave);
  }
}