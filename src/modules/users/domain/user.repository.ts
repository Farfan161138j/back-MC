
// Esta es la "forma" de un Usuario en nuestro negocio.
// Coincide con tu tabla 'usuario', pero sin decoradores de TypeORM.
export class UserDomain {
  id_usuario: number;
  email: string;
  nombre: string;
  apellidoPaterno?: string; // El '?' lo marca como opcional (nullable)
  apellidoMaterno?: string; // El '?' lo marca como opcional (nullable)
  idRol: number;
  isActive: boolean;
  
  // Nota: Omitimos 'passwordHash' a propósito.
  // El dominio puro no debería exponer datos sensibles
  // como contraseñas hasheadas.
}


// 2. Definimos la Interfaz (El Contrato / El "Puente")
// Esto es lo que la capa de Aplicación usará.
export interface UserRepository {
  
  /**
   * Busca un usuario por su email.
   * @param email El email del usuario a buscar.
   * @returns El usuario si se encuentra, o null si no.
   */
  findByEmail(email: string): Promise<UserDomain | null>;

  /**
   * Guarda (crea o actualiza) un usuario en la base de datos.
   * Usado por 'application' para crear el nuevo usuario.
   * @param user El objeto de usuario a guardar (sin id, ya que es nuevo)
   * @returns El usuario guardado (incluyendo el id_usuario).
   */
 save (user: any): Promise <UserDomain>;  
  

 findAll(): Promise<UserDomain[]>; // <-- ¡Añade esta línea!

 findById(id: number): Promise<UserDomain | null>; // <-- ¡Añade esta línea!

 delete(id: number): Promise<void>; // <-- ¡Añade esta línea!

 countByRol(idRol: number): Promise<number>;
}


// 3. Definimos el Token de Inyección para NestJS
// (Esto lo tenías perfecto)
// Es el "nombre" que NestJS usará para inyectar la implementación correcta.
export const UserRepository = Symbol('UserRepository');