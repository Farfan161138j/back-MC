import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  ForbiddenException, 
} from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';
// Asegúrate de importar tu Enum si lo vas a usar, o usa el número 1 directo
import { RoleEnum } from '../../domain/roles.enum'; 

@Injectable()
export class DeleteUserService {
  
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(id: number, requestingUser: any): Promise<void> {
    
    // 1. Buscamos a la víctima
    const userToDelete = await this.userRepository.findById(id);

    if (!userToDelete) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    // --- 🛡️ NUEVO: BLOQUEO GENERAL DE SEGURIDAD ---
    // Definimos quién hace la petición
    // (Si no tienes RoleEnum importado, usa el número 1 en lugar de RoleEnum.ADMIN)
    const isAdmin = requestingUser.rol === RoleEnum.ADMIN; 
    const isSelf = requestingUser.id === id; // ¿Te quieres borrar a ti mismo?

    // REGLA: Si NO eres Admin Y NO eres tú mismo... ¡ERROR!
    if (!isAdmin && !isSelf) {
      throw new ForbiddenException('No tienes permiso para eliminar a otros usuarios.');
    }
    // ----------------------------------------------

    // --- REGLAS DE PROTECCIÓN DE ADMINISTRADORES ---
    // Si el usuario a borrar es un ADMINISTRADOR (Rol 1)
    if (userToDelete.idRol === RoleEnum.ADMIN) {
      
      // Si un usuario normal intenta borrarse a sí mismo, pero resulta que es Admin...
      // (Esto es raro, pero por seguridad reforzamos que solo un Admin borra a un Admin, 
      //  o que el Admin se borre a sí mismo).
      
      // Regla de Supervivencia:
      const adminCount = await this.userRepository.countByRol(RoleEnum.ADMIN);

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