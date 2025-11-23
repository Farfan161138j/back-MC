import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceType } from '../entities/service-type.entity';
import { ServiceTypeRepository, ServiceTypeDomain } from '../../domain/service-type.repository';

@Injectable()
export class TypeOrmServiceTypeRepository implements ServiceTypeRepository {
  constructor(
    @InjectRepository(ServiceType)
    private readonly ormRepo: Repository<ServiceType>,
  ) {}

  async save(name: string): Promise<ServiceTypeDomain> {
    const newType = this.ormRepo.create({ name });
    const saved = await this.ormRepo.save(newType);
    
    // CAMBIO 1: Devolvemos services como array vacío al crear uno nuevo
    return { id: saved.id, name: saved.name, services: [] };
  }

  async findAll(): Promise<ServiceTypeDomain[]> {
    const types = await this.ormRepo.find({ 
      relations: ['services'], // CAMBIO 2: ¡La Magia! Pedimos los hijos.
      order: { name: 'ASC' } 
    });

    // CAMBIO 3: Mapeamos los resultados para incluir la lista de servicios
    return types.map(t => ({ 
      id: t.id, 
      name: t.name,
      // Si TypeORM trajo servicios, los mapeamos. Si no, devolvemos array vacío.
      services: t.services ? t.services.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description,
        isActive: s.isActive,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt
        // No necesitamos mapear createdBy aquí para no hacer un bucle infinito
      })) : []
    }));
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete(id);
  }
}