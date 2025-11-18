import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginService } from '../../application/login/login.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth') // Ruta base: /auth
export class AuthController {
  
  constructor(
    private readonly loginService: LoginService,
  ) {}

  /**
   * Endpoint para iniciar sesión.
   * Ruta: POST /auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK) // Un login exitoso devuelve 200 OK (no 201)
  async login(@Body() loginDto: LoginDto) {
    
    // 1. El DTO valida la entrada (gracias a los Pipes globales)
    // 2. Pasamos el DTO al "Cerebro"
    const result = await this.loginService.execute(loginDto);

    // 3. Devolvemos el resultado (el token)
    return result;
  }
}