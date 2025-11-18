import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { UserDomain, UserRepository } from '../../domain/user.repository';
import { User } from '../entities/user.entity'; // ¡El Mapa de TypeORM!

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  // 1. Inyectamos la herramienta de TypeORM (el "Mapa" de User)
  constructor(
    @InjectRepository(User)
    // Ahora 'TypeOrmRepository' es un tipo válido
    private readonly ormRepo: TypeOrmRepository<User>,
  ) {}

  

  // 2. Implementamos el método 'findByEmail' del contrato
  async findByEmail(email: string): Promise<UserDomain | null> {
    // Usamos la herramienta de TypeORM para buscar en la BD
    const user = await this.ormRepo.findOneBy({ email });


    
    // Si no lo encontramos, devolvemos null
    if (!user) {
      return null;
    }

    // Si lo encontramos, lo convertimos a UserDomain y lo devolvemos
    return this.toDomain(user);
  }
async findById(id: number): Promise<UserDomain | null> {
    // 1. Usamos findOneBy para buscar por la Primary Key
    const userEntity = await this.ormRepo.findOneBy({
      id_usuario: id,
    });

    // 2. Si no lo encontramos, devolvemos null
    if (!userEntity) {
      return null;
    }

    // 3. Si lo encontramos, lo traducimos y lo devolvemos
    return this.toDomain(userEntity);
  }
  // --- ¡AQUÍ ESTÁ LO NUEVO! ---
  /**
   * Implementación de 'findAll' del contrato.
   * Este es el nuevo "Obrero" que busca todos los usuarios.
   */
  async findAll(): Promise<UserDomain[]> {
    // 1. Usamos la herramienta de TypeORM para buscar TODOS los usuarios
    // .find() es el equivalente a "SELECT * FROM usuario"
    const usersEntities = await this.ormRepo.find();

    // 2. Traducimos cada entidad a un objeto de dominio
    // Usamos .map() para aplicar el traductor a cada item del array
    return usersEntities.map(userEntity => this.toDomain(userEntity));
  }
  // --- FIN DE LO NUEVO ---

  
  async delete(id: number): Promise<void> {
    // 1. Usamos la herramienta de TypeORM para borrar por ID
    // .delete() es la forma más eficiente de eliminar.
    // No necesitamos verificar si existe primero,
    // la base de datos simplemente no borrará nada si el ID no existe.
    await this.ormRepo.delete(id);
    
    // 2. No devolvemos nada (void)
    return;
  }
  async countByRol(idRol: number): Promise<number> {
    // Usamos el método nativo .count() de TypeORM
    // SQL equivalente: SELECT COUNT(*) FROM users WHERE id_rol = X
    const count = await this.ormRepo.count({
      where: { idRol: idRol },
    });
    return count;
  }
  // 3. Implementamos el método 'save' del contrato
  async save(userDomain: any): Promise<UserDomain> {
    // ¡AQUÍ ESTÁ LA SOLUCIÓN!
    // Le decimos a TS:
    // 1. Convierte esto a 'unknown' (olvida el tipo)
    // 2. LUEGO, trátalo como un 'User' (confía en mí)
    const userEntity = this.ormRepo.create(userDomain) as unknown as User;

    // Ahora 'userEntity' SÍ es de tipo 'User'
    const savedUser = await this.ormRepo.save(userEntity);

    // ¡Y esta línea SÍ funciona!
    return this.toDomain(savedUser);
  } // <-- La llave que cierra el método 'save'

  // 4. Creamos un "traductor" (Mapper) privado
  //
  // Convierte una Entidad (de BD) a un Dominio (de negocio)
  private toDomain(userEntity: User): UserDomain {
    const userDomain = new UserDomain();
    userDomain.id_usuario = userEntity.id_usuario;
    userDomain.email = userEntity.email;
    userDomain.nombre = userEntity.nombre;
    userDomain.apellidoPaterno = userEntity.apellidoPaterno;
    userDomain.apellidoMaterno = userEntity.apellidoMaterno;
    userDomain.idRol = userEntity.idRol;
    userDomain.isActive = userEntity.isActive;

    // Omitimos el passwordHash a propósito
    return userDomain;
  }
} // <-- Esta es la llave correcta que cierra la CLASE