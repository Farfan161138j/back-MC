import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from '../../../users/infrastructure/entities/user.entity';

// 1. IMPORTANTE: Importamos la entidad espejo que acabas de crear
import { ServiceType } from './service-type.entity';

@Entity('servicio') 
export class Service {

  @PrimaryGeneratedColumn({ name: 'id_servicio' })
  id: number;

  @Column({ name: 'nombre_servicio', length: 150 })
  name: string;

  @Column({ name: 'descripcion_servicio', type: 'text', nullable: true })
  description: string;

  

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamptz' })
  updatedAt: Date;

  // Relación: Quién creó el servicio
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  // 2. DESCOMENTAMOS Y ACTIVAMOS LA RELACIÓN
  @ManyToOne(() => ServiceType, { nullable: false }) 
  @JoinColumn({ name: 'id_tipo_servicio' }) // Apunta a la columna FK en la tabla 'servicio'
  serviceType: ServiceType;
}