import { Injectable, Inject } from '@nestjs/common';
import { ServiceRepository, ServiceDomain } from '../../domain/service.repository';
import { CreateServiceDto } from '../../infrastructure/controllers/dto/create-service.dto';

@Injectable()
export class CreateServiceService {
  constructor(
    @Inject(ServiceRepository)
    private readonly repository: ServiceRepository,
  ) {}

  async execute(dto: CreateServiceDto, userId: number): Promise<ServiceDomain> {
    // Preparamos el objeto para guardar
    const newService: Partial<ServiceDomain> = {
      name: dto.name,
      description: dto.description,
      isActive: dto.isActive ?? true, // Si no envían nada, activo por defecto
      serviceTypeId: dto.serviceTypeId,
      createdBy: userId, // Guardamos quién lo creó (Admin)
    };

    return this.repository.save(newService);
  }
}