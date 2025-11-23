import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ServiceRepository } from '../../domain/service.repository';

@Injectable()
export class DeleteServiceService {
  constructor(
    @Inject(ServiceRepository)
    private readonly repository: ServiceRepository,
  ) {}

  async execute(id: number): Promise<void> {
    // Verificar si existe antes de borrar
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }
    await this.repository.delete(id);
  }
}