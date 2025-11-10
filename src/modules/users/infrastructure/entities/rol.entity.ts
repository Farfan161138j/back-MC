import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'rol' }) // Coincide con: CREATE TABLE rol
export class Rol {

  @PrimaryGeneratedColumn() // Coincide con: id_rol SERIAL PRIMARY KEY
  id_rol: number;

  @Column({ 
    name: 'nombre_rol', // Coincide con: nombre_rol
    type: 'varchar', 
    length: 50, 
    unique: true, 
    nullable: false 
  })
  nombreRol: string;

  // Relación inversa: Un rol puede tener muchos usuarios
  @OneToMany(() => User, user => user.rol)
  users: User[];
}