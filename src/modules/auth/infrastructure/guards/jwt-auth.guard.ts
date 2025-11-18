import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Este es nuestro "Cadenero".
 * Hereda toda la lógica de 'AuthGuard' de passport usando la estrategia 'jwt'.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}