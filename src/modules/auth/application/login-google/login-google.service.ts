// 1. 👇 AGREGAMOS 'Inject' AQUÍ
import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository, UserDomain } from '../../../users/domain/user.repository'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginGoogleService {
  constructor(
    @Inject(UserRepository) 
    private readonly userRepository: UserRepository, 
    private readonly jwtService: JwtService,
  ) {}

  async execute(googleUser: any) {
    const { email, firstName, lastName } = googleUser;

    // 1. Buscamos si ya existe
    let user = await this.userRepository.findByEmail(email);

    // 2. Si no existe, lo creamos
    if (!user) {
      console.log('Usuario de Google nuevo. Registrando...');
      
      const newUser = new UserDomain();
      newUser.email = email;
      newUser.nombre = firstName;
      
      // Google a veces no tiene apellido, usamos un punto para cumplir con la BD
      newUser.apellidoPaterno = lastName || '.'; 
      newUser.isActive = true;
      newUser.idRol = 2; // Cliente
      
      // Generamos password basura y lo encriptamos
      const randomPassword = Math.random().toString(36).slice(-8);
      const hash = await bcrypt.hash(randomPassword, 10);
      
      // Preparamos el objeto para guardar
     const userToSave = { 
          ...newUser, 
          // Enviamos el hash con los dos nombres posibles para que TypeORM no se confunda
          password: hash,      // Por si tu entidad tiene: @Column() password: string
          passwordHash: hash,  // Por si tu entidad tiene: @Column() passwordHash: string
      };
      
      user = await this.userRepository.save(userToSave);
    }

    // 3. Generamos el Token
    const payload = { 
      sub: user.id_usuario, 
      email: user.email, 
      rol: user.idRol 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email: user.email,
        name: user.nombre,
        role: user.idRol
      }
    };
  }
}