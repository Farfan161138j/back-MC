import { Injectable, Inject } from '@nestjs/common';
import { ServiceTypeRepository, ServiceTypeDomain } from '../../domain/service-type.repository';

@Injectable()
export class GetAllServiceTypesService {
  constructor(
    @Inject(ServiceTypeRepository)
    private readonly repository: ServiceTypeRepository,
  ) {}

  async execute(): Promise<ServiceTypeDomain[]> {
    return this.repository.findAll();
  }
}