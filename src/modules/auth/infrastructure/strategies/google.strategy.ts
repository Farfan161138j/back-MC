import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  
  constructor(private configService: ConfigService) {
    super({
      // Agregamos " || '' " para calmar a TypeScript strict mode
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || '',
      
      // Pedimos email y datos básicos del perfil
      scope: ['email', 'profile'],
    });
  }

  // Esta función debe estar DENTRO de la clase
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    
    // Extraemos solo lo útil del perfil gigante que manda Google
    const { name, emails, photos } = profile;

    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos && photos[0] ? photos[0].value : null, // Validación extra por si no tiene foto
      accessToken,
    };

    // Le pasamos este objeto limpio al Controller/Service
    done(null, user);
  }
}