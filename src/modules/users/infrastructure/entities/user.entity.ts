import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { Rol } from './rol.entity';

@Entity({ name: 'usuario' }) // Coincide con: CREATE TABLE usuario
export class User {

  @PrimaryGeneratedColumn() // Coincide con: id_usuario SERIAL PRIMARY KEY
  id_usuario: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255, nullable: false, select: false })
  passwordHash: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;

  @Column({ name: 'apellido_paterno', type: 'varchar', length: 100, nullable: true })
  apellidoPaterno: string;

  @Column({ name: 'apellido_materno', type: 'varchar', length: 100, nullable: true })
  apellidoMaterno: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  // --- Relación con Rol ---
  // Coincide con: id_rol INT NOT NULL REFERENCES rol(id_rol)

  @Column({ name: 'id_rol', type: 'int', nullable: false })
  idRol: number; // Propiedad para el ID numérico

  @ManyToOne(() => Rol, rol => rol.users, { nullable: false })
  @JoinColumn({ name: 'id_rol' }) // Le dice a TypeORM que 'id_rol' es la FK
  rol: Rol; // Propiedad para el objeto Rol completo
}