import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { UserDomain, UserRepository } from '../../domain/user.repository';
import { User } from '../entities/user.entity'; 

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  
  constructor(
    @InjectRepository(User)
    private readonly ormRepo: TypeOrmRepository<User>,
  ) {}

  async findByEmail(email: string): Promise<UserDomain | null> {
    const user = await this.ormRepo.findOneBy({ email });
    if (!user) return null;
    return this.toDomain(user);
  }

  async findById(id: number): Promise<UserDomain | null> {
    const userEntity = await this.ormRepo.findOneBy({ id_usuario: id });
    if (!userEntity) return null;
    return this.toDomain(userEntity);
  }

  async findAll(): Promise<UserDomain[]> {
    const usersEntities = await this.ormRepo.find();
    return usersEntities.map(userEntity => this.toDomain(userEntity));
  }
  
  async delete(id: number): Promise<void> {
    await this.ormRepo.delete(id);
    return;
  }

  async countByRol(idRol: number): Promise<number> {
    const count = await this.ormRepo.count({
      where: { idRol: idRol },
    });
    return count;
  }

  async save(userDomain: any): Promise<UserDomain> {
    // 1. Convertimos Dominio -> Entidad
    // TypeORM mapea automáticamente 'whatsappNumber' porque se llaman igual
    const userEntity = this.ormRepo.create(userDomain) as unknown as User;

    // 2. Guardamos en BD
    const savedUser = await this.ormRepo.save(userEntity);

    // 3. Devolvemos Dominio
    return this.toDomain(savedUser);
  } 

  // --- TRADUCTOR (MAPPER) ---
  private toDomain(userEntity: User): UserDomain {
    const userDomain = new UserDomain();
    userDomain.id_usuario = userEntity.id_usuario;
    userDomain.email = userEntity.email;
    userDomain.nombre = userEntity.nombre;
    userDomain.apellidoPaterno = userEntity.apellidoPaterno;
    userDomain.apellidoMaterno = userEntity.apellidoMaterno;
    userDomain.idRol = userEntity.idRol;
    userDomain.isActive = userEntity.isActive;
    
    // 👇 ESTA ES LA LÍNEA QUE IMPORTA
    // Sin esto, podrías guardar el teléfono, pero nunca lo verías al consultar.
    userDomain.whatsappNumber = userEntity.whatsappNumber;

    return userDomain;
  }
}