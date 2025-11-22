import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ProductRepository, ProductDomain } from '../../domain/product.repository';
import { UpdateProductDto } from '../../infrastructure/controllers/dto/update-product.dto';

@Injectable()
export class UpdateProductService {
  constructor(
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  public async execute(id: number, dto: UpdateProductDto): Promise<ProductDomain> {
    // 1. Verificamos que exista
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // 2. Combinamos los datos viejos con los nuevos
    const updatedData = {
      ...product, // Datos actuales
      ...dto,     // Datos nuevos (sobreescriben)
      id: id,     // Aseguramos que el ID no cambie
    };

    // 3. Guardamos
    return this.productRepository.save(updatedData);
  }
}