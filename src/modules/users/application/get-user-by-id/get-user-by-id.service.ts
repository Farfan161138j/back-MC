// src/modules/users/application/get-user-by-id/get-user-by-id.service.ts

import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException, // <--- 1. NUEVO IMPORT
} from '@nestjs/common';
import {
  UserDomain,
  UserRepository,
} from '../../domain/user.repository';
import { RoleEnum } from '../../domain/roles.enum'; // <--- 2. NUEVO IMPORT

@Injectable()
export class GetUserByIdService {
  
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Ahora recibimos también quién está pidiendo la info.
   */
  public async execute(id: number, requestingUser: any): Promise<UserDomain> { // <--- 3. PARAMETRO NUEVO
    
    // --- 🛡️ 4. BLOQUE DE SEGURIDAD NUEVO ---
    const isAdmin = requestingUser.rol === RoleEnum.ADMIN;
    const isOwner = requestingUser.id === id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('No tienes permiso para ver la información de otro usuario.');
    }
    // ---------------------------------------
    
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    return user;
  }
}