import { SetMetadata } from '@nestjs/common';
// Importamos el Enum desde el dominio de Usuarios
import { RoleEnum } from '../../../users/domain/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);