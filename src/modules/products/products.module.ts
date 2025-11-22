import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './infrastructure/entities/product.entity';

// 1. Importamos el Controller
import { ProductsController } from './infrastructure/controllers/products.controller';

// 2. Importamos Repositorios
import { ProductRepository } from './domain/product.repository';
import { TypeOrmProductRepository } from './infrastructure/persistence/product.repository';

// 3. Importamos TODOS los Servicios (Cerebros)
import { CreateProductService } from './application/create-product/create-product.service';
import { GetAllProductsService } from './application/get-all-products/et-all-products.service'; // <--- ¡ESTE ERA EL CULPABLE!
import { GetProductByIdService } from './application/get-product-by-id/get-product-by-id.service';
import { UpdateProductService } from './application/update-product/update-product.service';
import { DeleteProductService } from './application/delete-product/delete-product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [
    ProductsController // Registramos la ventanilla
  ],
  providers: [
    // Registramos al Obrero
    {
      provide: ProductRepository,
      useClass: TypeOrmProductRepository,
    },
    // Registramos TODOS los Cerebros
    CreateProductService,
    GetAllProductsService, // <--- ¡ASEGÚRATE QUE ESTÉ AQUÍ!
    GetProductByIdService,
    UpdateProductService,
    DeleteProductService,
  ],
  exports: [ProductRepository],
})
export class ProductsModule {}