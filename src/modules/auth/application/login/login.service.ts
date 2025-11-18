// src/modules/auth/application/login/login.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // Ya no necesitamos ConfigService aquí
import { UsersService } from '../../../users/users.service';
import { LoginDto } from '../../infrastructure/controllers/dto/login.dto'; // Ajusta la ruta si es necesario
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginService {
  
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    // Ya no necesitamos inyectar ConfigService
  ) {}

  public async execute(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Buscamos al usuario
    const user = await this.usersService.findForLogin(email);

    // 2. Verificaciones de seguridad
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Credenciales no válidas');
    }

    // 3. Comparamos contraseña
    const isPasswordMatching = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciales no válidas');
    }

    // 4. Creamos el payload
    const payload = {
      sub: user.id_usuario,
      email: user.email,
      rol: user.idRol,
    };

    // 5. Firmamos el token
    // ¡OJO! Al no pasarle opciones, usa el secreto que configuramos en AuthModule
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Login exitoso',
      accessToken,
    };
  }
}