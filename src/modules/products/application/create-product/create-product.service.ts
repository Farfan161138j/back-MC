import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { ProductRepository, ProductDomain } from '../../domain/product.repository';
import { CreateProductDto } from '../../infrastructure/controllers/dto/create-product.dto';

@Injectable()
export class CreateProductService {
  
  constructor(
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  /**
   * Crea un nuevo producto.
   * @param dto Datos del producto
   * @param userId ID del usuario que lo está creando (viene del Token)
   */
  public async execute(dto: CreateProductDto, userId: number): Promise<ProductDomain> {
    
    // 1. REGLA DE NEGOCIO: No permitir nombres duplicados
    const existingProduct = await this.productRepository.findByName(dto.name);
    
    if (existingProduct) {
      throw new ConflictException(`El producto '${dto.name}' ya existe.`);
    }

    // 2. Preparamos el objeto para guardar
    const newProduct: Partial<ProductDomain> = {
      name: dto.name,
      categoryId: dto.categoryId,
      description: dto.description,
      image: dto.image,
      // Si no envían cantidad, asumimos 0
      availableQuantity: dto.availableQuantity || 0,
      soldQuantity: 0,
      isActive: true,
      createdBy: userId, // ¡Aquí vinculamos al usuario del Token!
    };

    // 3. Guardamos
    return this.productRepository.save(newProduct);
  }
}