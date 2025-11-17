// src/modules/users/application/get-user-by-id/get-user-by-id.service.ts

import {
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import {
  UserDomain,
  UserRepository,
} from '../../domain/user.repository';

@Injectable()
export class GetUserByIdService {
  
  // 1. Inyectamos el "Contrato" (UserRepository)
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Este es el "Caso de Uso" para obtener un usuario por su ID.
   * @param id El ID del usuario a buscar.
   */
  public async execute(id: number): Promise<UserDomain> {
    
    // 1. Le pedimos al "Obrero" (a través del "Contrato")
    // que busque al usuario por su ID.
    const user = await this.userRepository.findById(id);

    // 2. ¡Lógica de Negocio!
    // Si el "Obrero" nos devuelve 'null', significa
    // que no lo encontró. Lanzamos un error.
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    // 3. Devolvemos el usuario encontrado.
    return user;
  }
}