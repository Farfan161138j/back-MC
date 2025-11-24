import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('estado_solicitud') // <--- CAMBIO: Apuntamos al nuevo nombre
export class RequestStatus {
  
  // <--- CAMBIO: Apuntamos al nuevo nombre de columna
  @PrimaryGeneratedColumn({ name: 'id_estado_solicitud' }) 
  id: number;

  @Column({ name: 'nombre_estado', length: 20 })
  name: string;
}