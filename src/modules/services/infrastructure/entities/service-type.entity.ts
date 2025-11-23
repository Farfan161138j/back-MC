import { Entity, PrimaryGeneratedColumn, Column,OneToMany } from 'typeorm';
import { Service } from './service.entity'; // <--- Importar la entidad hija
@Entity('tipo_servicio') // Mapeamos a tu tabla existente en PostgreSQL
export class ServiceType {
  
  @PrimaryGeneratedColumn({ name: 'id_tipo_servicio' })
  id: number;

  @Column({ name: 'nombre_tipo', length: 50 })
  name: string;

  @OneToMany(() => Service, (service) => service.serviceType)
  services: Service[];
}