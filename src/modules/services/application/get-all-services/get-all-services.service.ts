import { Injectable, Inject } from '@nestjs/common';
import { ServiceRepository, ServiceDomain } from '../../domain/service.repository';

@Injectable()
export class GetAllServicesService {
  constructor(
    @Inject(ServiceRepository)
    private readonly repository: ServiceRepository,
  ) {}

  async execute(): Promise<ServiceDomain[]> {
    return this.repository.findAll();
  }
}