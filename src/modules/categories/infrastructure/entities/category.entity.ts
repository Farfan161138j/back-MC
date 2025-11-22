import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';

@Entity('categoria') // Nombre de la tabla en la BD
export class Category {
  
  @PrimaryGeneratedColumn({ name: 'id_categoria' })
  id: number;

  @Column({ name: 'nombre_categoria', length: 100, unique: true }) // unique: No queremos dos categorías con el mismo nombre
  name: string;

  @Column({ name: 'descripcion_categoria', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamptz' })
  updatedAt: Date;
}