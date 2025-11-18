import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  ForbiddenException, // <-- Asegúrate de tener esto importado
} from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';

@Injectable()
export class DeleteUserService {
  
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  // 1. ACTUALIZADO: Ahora recibe 'requestingUser' (quién hace la petición)
  public async execute(id: number, requestingUser: any): Promise<void> {
    
    // Buscamos a la víctima
    const userToDelete = await this.userRepository.findById(id);

    // Si no existe, lanzamos un error 404
    if (!userToDelete) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    // --- REGLAS DE PROTECCIÓN DE ADMINISTRADORES ---
    
    // Si el usuario a borrar es un ADMINISTRADOR (Rol 1)
    if (userToDelete.idRol === 1) {
      
      // A) REGLA DE JERARQUÍA:
      // Si quien intenta borrar NO es Admin (Rol != 1)
      if (requestingUser.rol !== 1) {
        throw new ForbiddenException('No tienes permisos para eliminar a un Administrador.');
      }

      // B) REGLA DE SUPERVIVENCIA:
      // Contamos cuántos admins existen (para no borrar al último)
      const adminCount = await this.userRepository.countByRol(1);

      if (adminCount <= 1) {
        throw new ConflictException(
          'No se puede eliminar al usuario porque es el único Administrador existente.',
        );
      }
    }
    // ------------------------------------------------

    // Si pasó todas las pruebas, procedemos a eliminar
    await this.userRepository.delete(id);
    
    return;
  }
}