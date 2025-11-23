import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator'; // El decorador que acabas de hacer
import { RoleEnum } from '../../../users/domain/roles.enum'; // El Enum que acabas de hacer

@Injectable()
export class RolesGuard implements CanActivate {
  
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    
    // 1. Buscamos la etiqueta @Roles en la ruta
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay etiqueta @Roles, dejamos pasar (es ruta pública o solo requiere login)
    if (!requiredRoles) {
      return true;
    }

    // 2. Obtenemos el usuario (¡Aquí es donde usamos el trabajo de JwtAuthGuard!)
    const { user } = context.switchToHttp().getRequest();

    // 3. Verificamos: ¿El rol del usuario está en la lista permitida?
    // NOTA: Asegúrate de que en tu jwt.strategy.ts estés guardando el rol como 'rol'.
    // Si allá pusiste 'role', aquí cambia a user.role
    const hasRole = requiredRoles.some((role) => user.rol === role);
    
    if (!hasRole) {
        throw new ForbiddenException('No tienes permisos de Administrador para realizar esta acción.');
    }

    return true;
  }
}