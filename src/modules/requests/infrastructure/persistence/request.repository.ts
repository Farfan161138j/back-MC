import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from '../entities/request.entity';
import { RequestRepository } from '../../domain/request.repository';

@Injectable()
export class TypeOrmRequestRepository implements RequestRepository {
  constructor(
    @InjectRepository(Request)
    private readonly ormRepo: Repository<Request>,
  ) {}

  async save(request: Request): Promise<Request> {
    return this.ormRepo.save(request);
  }

  // --- 👇 ESTO ES LO QUE TE FALTABA 👇 ---
  async findByUserId(userId: number): Promise<Request[]> {
    return this.ormRepo.find({
      // OJO: Usamos 'id_usuario' porque así se llama tu columna en la entidad User
      where: { user: { id_usuario: userId } }, 
      relations: [
        'status',                   // Traer el estado (Pendiente, Finalizado)
        'items',                    // Traer los items de la lista
        'items.product',            // Traer el nombre del producto
        'items.service',            // Traer el nombre del servicio
        'items.service.serviceType' // Traer el tipo (Mantenimiento, etc.)
      ],
      order: { createdAt: 'DESC' }  // Ordenar: Lo más nuevo primero
    });
  }

  // --- TAMBIÉN AGREGA ESTE PARA EL ADMIN (Ver todos) ---
  async findAll(): Promise<Request[]> {
    return this.ormRepo.find({
      relations: [
        'user', // El admin necesita saber QUIÉN pidió
        'status', 
        'items', 
        'items.product', 
        'items.service'
      ],
      order: { createdAt: 'DESC' }
    });
  }
}