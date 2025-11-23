import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../entities/service.entity';
import { ServiceRepository, ServiceDomain } from '../../domain/service.repository';

@Injectable()
export class TypeOrmServiceRepository implements ServiceRepository {
  
  constructor(
    @InjectRepository(Service)
    private readonly ormRepo: Repository<Service>,
  ) {}

  async save(data: Partial<ServiceDomain>): Promise<ServiceDomain> {
    const entity: any = { ...data };

    // Mapeo inverso: Dominio -> Entidad (Para guardar)
    if (data.serviceTypeId) {
      entity.serviceType = { id: data.serviceTypeId }; 
    }
    
    if (data.createdBy) {
      // TypeORM necesita el objeto User. 
      // Usamos 'id' porque generalmente la propiedad de clase es 'id' 
      // (aunque la columna BD sea id_usuario).
      // Si tu entidad User tiene la propiedad 'id_usuario', cambia 'id' por 'id_usuario' aquí.
      entity.createdBy = { id: data.createdBy }; 
    }

    const saved = await this.ormRepo.save(entity);
    return this.mapToDomain(saved);
  }

  async findAll(): Promise<ServiceDomain[]> {
    const services = await this.ormRepo.find({
      relations: ['serviceType', 'createdBy'], 
      order: { name: 'ASC' },
    });
    return services.map(item => this.mapToDomain(item));
  }

  async findById(id: number): Promise<ServiceDomain | null> {
    const service = await this.ormRepo.findOne({ 
      where: { id },
      relations: ['serviceType', 'createdBy'] 
    });
    return service ? this.mapToDomain(service) : null;
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete(id);
  }

  // Mapeo: Entidad -> Dominio (Para leer)
  private mapToDomain(entity: Service): ServiceDomain {
    
    // TRUCO DE SEGURIDAD:
    // A veces TypeORM devuelve user.id y a veces user.id_usuario dependiendo de tu entidad.
    // Hacemos un chequeo seguro:
    let creatorId = null;
    if (entity.createdBy) {
        // Intentamos leer 'id', si no existe, leemos 'id_usuario'
        creatorId = (entity.createdBy as any).id || (entity.createdBy as any).id_usuario || null;
    }

    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      
      createdBy: creatorId,
      serviceTypeId: entity.serviceType ? entity.serviceType.id : null,
      serviceTypeName: entity.serviceType ? entity.serviceType.name : null,
    };
  }
}