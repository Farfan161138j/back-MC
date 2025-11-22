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
// 1. IMPORTAR LA ENTIDAD CATEGORÍA
import { Category } from '../../../categories/infrastructure/entities/category.entity';

@Entity('producto') 
export class Product { 
  
  @PrimaryGeneratedColumn({ name: 'id_producto' })
  id: number;

  @Column({ name: 'nombre_producto', length: 255 })
  name: string;

  // --- MODIFICADO: CAMBIO DE COLUMNA SIMPLE A RELACIÓN ---
  
  // ANTES (Comentado):
  // @Column({ name: 'id_categoria', type: 'int', nullable: true })
  // categoryId: number;

  // AHORA (Relación):
  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'id_categoria' }) // Apuntamos a la misma columna SQL
  category: Category;

  // -------------------------------------------------------

  @Column({ name: 'descripcion_producto', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'imagen_producto', length: 255, nullable: true })
  image: string;

  @Column({ name: 'cantidad_vendida', type: 'int', default: 0 })
  soldQuantity: number;

  @Column({ name: 'cantidad_disponible', type: 'int', default: 0 })
  availableQuantity: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'fecha_creacion_producto', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion_producto', type: 'timestamptz' })
  updatedAt: Date;

  // Relación con el Usuario que creó el producto
  @ManyToOne(() => User, { nullable: true }) 
  @JoinColumn({ name: 'created_by' })
  createdBy: User; 
}