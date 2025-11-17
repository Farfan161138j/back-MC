// src/modules/users/application/get-all-users/get-all-users.service.ts

import { Injectable, Inject } from '@nestjs/common';
import {
  UserDomain,
  UserRepository,
} from '../../domain/user.repository';

@Injectable()
export class GetAllUsersService { // <-- Renombrado para coincidir
  
  // 1. Inyectamos el "Contrato" (UserRepository)
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  
  /**
   * Este es el "Caso de Uso" para obtener todos los usuarios.
   */
  public async execute(): Promise<UserDomain[]> {
    
    // 1. Simplemente le pedimos al "Obrero" (a través del "Contrato")
    // que nos traiga todos los usuarios.
    const users = await this.userRepository.findAll();

    // 2. Devolvemos el array de usuarios.
    return users;
  }
}   