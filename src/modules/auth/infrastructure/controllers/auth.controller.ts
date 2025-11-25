import { 
  Controller, 
  Post, 
  Get,           // <--- Nuevo
  Body, 
  HttpCode, 
  HttpStatus, 
  UseGuards,     // <--- Nuevo
  Req,           // <--- Nuevo
  Res            // <--- Nuevo
} from '@nestjs/common';

// Servicios
import { LoginService } from '../../application/login/login.service';
import { LoginGoogleService } from '../../application/login-google/login-google.service'; // <--- Nuevo Servicio

// DTOs y Guards
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from '../guards/google-auth.guard'; // <--- Nuevo Guard

@Controller('auth')
export class AuthController {
  
  constructor(
    private readonly loginService: LoginService,
    private readonly loginGoogleService: LoginGoogleService, // <--- Inyección Nueva
  ) {}

  /**
   * 1. Login Normal (Email/Password)
   * Ruta: POST /auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.loginService.execute(loginDto);
  }

  /**
   * 2. Iniciar proceso con Google
   * Ruta: GET /auth/google
   * Acción: Redirige al usuario a la página de "Selecciona tu cuenta" de Google
   */
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    // No necesitas código aquí. 
    // El Guard inicia el flujo de Passport automáticamente.
  }

  /**
   * 3. Callback de Google (Regreso)
   * Ruta: GET /auth/google/callback
   * Acción: Google nos devuelve al usuario, lo procesamos y redirigimos al Frontend
   */
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res) {
    // A. Obtenemos el usuario validado por Google desde la Request
    const googleUser = req.user;

    // B. Usamos nuestro servicio para Crear o Loguear al usuario en nuestra BD
    const loginResult = await this.loginGoogleService.execute(googleUser);

    // C. Redirigimos al Frontend enviando el token en la URL
    // ⚠️ CAMBIA 'http://localhost:5173' por la URL real de tu Frontend
    // Ejemplo: http://localhost:5173/login?token=eyJhbGciOiJIUzI1Ni...
    res.redirect(`http://localhost:5173/login?token=${loginResult.access_token}`);
  }
}