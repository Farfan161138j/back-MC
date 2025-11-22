import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../domain/product.repository';

@Injectable()
export class DeleteProductService {
  constructor(
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  public async execute(id: number): Promise<void> {
    // 1. Verificamos que exista
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // 2. Borramos
    await this.productRepository.delete(id);
  }
}