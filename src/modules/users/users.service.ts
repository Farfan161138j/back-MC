// src/modules/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './infrastructure/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly ormRepo: Repository<User>,
  ) {}

  /**
   * Este método es usado SÓLO por el AuthModule.
   * Busca un usuario por email y, a diferencia del
   * 'UserRepository', SÍ selecciona el passwordHash.
   */
  async findForLogin(email: string) {
    // Usamos QueryBuilder para seleccionar explícitamente el password
    // ya que puede estar oculto por defecto en la entidad.
    const user = await this.ormRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.passwordHash') // ¡La clave! Traemos el hash.
      .getOne();

    return user;
  }
}