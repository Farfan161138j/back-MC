import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// Importamos al padre
import { Request } from './request.entity'; 
import { Product } from '../../../products/infrastructure/entities/product.entity';
import { Service } from '../../../services/infrastructure/entities/service.entity';

@Entity('detalle_solicitud')
export class RequestItem {

  @PrimaryGeneratedColumn({ name: 'id_detalle' })
  id: number;

  @Column({ name: 'cantidad', type: 'int' })
  quantity: number;

  // Ahora sí, 'request.items' ya existe en el otro archivo, así que el error desaparece
  @ManyToOne(() => Request, (request) => request.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_solicitud' })
  request: Request;

  @ManyToOne(() => Product, { nullable: true })
  @JoinColumn({ name: 'id_producto' })
  product: Product;

  @ManyToOne(() => Service, { nullable: true })
  @JoinColumn({ name: 'id_servicio' })
  service: Service;
}