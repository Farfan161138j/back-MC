import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// 1. Asegúrate de que estos dos se importen desde 'passport-jwt'
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      // 2. Extraemos el token del Header Bearer
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // 3. Rechazamos tokens expirados
      ignoreExpiration: false,
      
      // 4. ¡AQUÍ ESTABA EL ERROR!
      // TypeScript se queja si cree que esto puede ser undefined.
      // Agregamos ' || "secret" ' como respaldo temporal para que compile,
      // o usamos el signo '!' si estamos seguros de que existe.
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secretKeyRefugio', 
    });
  }

  async validate(payload: any) {
    // Esto añade los datos del usuario a la request (req.user)
    return { 
      id: payload.sub, 
      email: payload.email, 
      rol: payload.rol 
    };
  }
}