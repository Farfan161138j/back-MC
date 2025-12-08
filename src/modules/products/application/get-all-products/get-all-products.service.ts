import { Injectable, Inject } from '@nestjs/common';
import { ProductRepository, ProductDomain } from '../../domain/product.repository';

@Injectable()
export class GetAllProductsService {
  constructor(
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  // Recibimos paginación básica (página 1, 10 por página por defecto)
  public async execute(page: number = 1, limit: number = 10): Promise<ProductDomain[]> {
    const take = limit;
    const skip = (page - 1) * limit;

    return await this.productRepository.find({
      take,
      skip,
      relations: ['category'],
    });
  }
}