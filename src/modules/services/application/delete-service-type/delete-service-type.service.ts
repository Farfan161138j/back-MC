import { Injectable, Inject } from '@nestjs/common';
import { ServiceTypeRepository } from '../../domain/service-type.repository';

@Injectable()
export class DeleteServiceTypeService {
  constructor(
    @Inject(ServiceTypeRepository)
    private readonly repository: ServiceTypeRepository,
  ) {}

  async execute(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}