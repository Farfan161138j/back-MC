// src/modules/users/application/delete-user/delete-user.service.ts

import {
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';

@Injectable()
export class DeleteUserService {
  
  // 1. Inyectamos el "Contrato" (UserRepository)
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Este es el "Caso de Uso" para eliminar un usuario.
   * @param id El ID del usuario a eliminar.
   */
  public async execute(id: number): Promise<void> {
    
    // 1. ¡Lógica de Negocio!
    // Verificamos si el usuario existe primero.
    // (Reutilizamos el 'findById' que ya existe)
    const user = await this.userRepository.findById(id);

    // 2. Si no existe, lanzamos un error 404
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    // 3. Si existe, le pedimos al "Obrero" que lo elimine.
    await this.userRepository.delete(id);

    // 4. No devolvemos nada (void)
    return;
  }
}