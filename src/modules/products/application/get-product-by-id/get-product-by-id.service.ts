import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ProductRepository, ProductDomain } from '../../domain/product.repository';

@Injectable()
export class GetProductByIdService {
  constructor(
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  public async execute(id: number): Promise<ProductDomain> {
    const product = await this.productRepository.findById(id);
    
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    
    return product;
  }
}