import { Injectable, Inject } from '@nestjs/common';
import { ServiceTypeRepository, ServiceTypeDomain } from '../../domain/service-type.repository';
import { CreateServiceTypeDto } from '../../infrastructure/controllers/dto/create-service-type.dto';

@Injectable()
export class CreateServiceTypeService {
  constructor(
    @Inject(ServiceTypeRepository)
    private readonly repository: ServiceTypeRepository,
  ) {}

  async execute(dto: CreateServiceTypeDto): Promise<ServiceTypeDomain> {
    return this.repository.save(dto.name);
  }
}