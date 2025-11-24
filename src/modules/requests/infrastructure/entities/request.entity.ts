import { 
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, 
  UpdateDateColumn, ManyToOne, JoinColumn, OneToMany // <--- IMPORTANTE: OneToMany
} from 'typeorm';
import { User } from '../../../users/infrastructure/entities/user.entity';
import { RequestStatus } from './request-status.entity';
// Importamos al hijo
import { RequestItem } from './request-item.entity'; 

@Entity('solicitud')
export class Request {
  
  @PrimaryGeneratedColumn({ name: 'id_solicitud' })
  id: number;

  @Column({ name: 'mensaje_cliente', type: 'text', nullable: true })
  clientMessage?: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'id_usuario' })
  user: User;

  @ManyToOne(() => RequestStatus, { nullable: false })
  @JoinColumn({ name: 'id_estado' })
  status: RequestStatus;

  // --- 👇 ESTA ES LA PROPIEDAD QUE TE FALTA O QUE TYPEORM NO VEÍA 👇 ---
  @OneToMany(() => RequestItem, (item) => item.request, { cascade: true })
  items: RequestItem[]; 
  // --------------------------------------------------------------------
}