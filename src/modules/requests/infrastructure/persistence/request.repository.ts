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

  // --- 👇 AQUÍ ESTÁ LA CORRECCIÓN (findOneOrFail) 👇 ---
  async save(request: Request): Promise<Request> {
    // 1. Guardamos la data inicial
    const savedRequest = await this.ormRepo.save(request);

    // 2. Recargamos INMEDIATAMENTE con relaciones
    // Usamos findOneOrFail para asegurar que NO devuelva null
    return this.ormRepo.findOneOrFail({
      where: { id: savedRequest.id },
      relations: [
        'user',           
        'items', 
        'items.product',  // Nombres de productos
        'items.service'   // Nombres de servicios
      ]
    });
  }
  // ----------------------------------------------------

  async findByUserId(userId: number): Promise<Request[]> {
    return this.ormRepo.find({
      where: { user: { id_usuario: userId } }, 
      relations: [
        'status', 
        'items', 
        'items.product',  
        'items.service',
        'items.service.serviceType'
      ],
      order: { createdAt: 'DESC' } 
    });
  }

  async findAll(): Promise<Request[]> {
    return this.ormRepo.find({
      relations: [
        'user', 
        'status', 
        'items', 
        'items.product', 
        'items.service'
      ],
      order: { createdAt: 'DESC' }
    });
  }
}