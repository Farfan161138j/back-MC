// src/modules/products/infrastructure/persistence/product.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductRepository, ProductDomain } from '../../domain/product.repository';

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
  
  constructor(
    @InjectRepository(Product)
    private readonly ormRepo: Repository<Product>,
  ) {}

  /**
   * Guardar o Actualizar
   */
  async save(productData: Partial<ProductDomain>): Promise<ProductDomain> {
    const dataToSave: any = {
      ...productData,
    };

    if (productData.createdBy) {
      dataToSave.createdBy = { id_usuario: productData.createdBy };
    }

    if (productData.categoryId) {
      dataToSave.category = { id: productData.categoryId };
    }

    const savedProduct = await this.ormRepo.save(dataToSave);
    return this.mapToDomain(savedProduct);
  }

  /**
   * Buscar todos
   */
  async findAll(page: number, limit: number): Promise<ProductDomain[]> {
    const skip = (page - 1) * limit;
    
    const products = await this.ormRepo.find({
      skip: skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['createdBy', 'category'] 
    });

    return products.map(product => this.mapToDomain(product));
  }

  /**
   * Buscar por ID
   */
  async findById(id: number): Promise<ProductDomain | null> {
    const product = await this.ormRepo.findOne({ 
      where: { id },
      relations: ['createdBy', 'category'] 
    });
    return product ? this.mapToDomain(product) : null;
  }

  /**
   * Buscar por Nombre
   */
  async findByName(name: string): Promise<ProductDomain | null> {
    const product = await this.ormRepo.findOne({ where: { name } });
    return product ? this.mapToDomain(product) : null;
  }

  /**
   * Eliminar
   */
  async delete(id: number): Promise<void> {
    await this.ormRepo.delete(id);
  }

  // =========================================================
  // MÉTODO AGREGADO: implementa 'find' requerido por la interfaz
  // =========================================================
  async find(options: any): Promise<ProductDomain[]> {
    const products = await this.ormRepo.find(options);
    return products.map(product => this.mapToDomain(product));
  }

  /**
   * MAPPER
   */
  private mapToDomain(entity: Product): ProductDomain {
    return {
      id: entity.id,
      name: entity.name,
      
      // Si la entidad trae category cargada, exponemos su objeto (y también categoryId)
      category: entity.category ? {
        id: entity.category.id,
        // Ajusta el campo 'name' si tu entidad usa otro nombre (p. ej. 'nombre_categoria')
        name: (entity.category as any).name ?? (entity.category as any).nombre_categoria ?? null,
      } : null,      
      description: entity.description,
      image: entity.image,
      soldQuantity: entity.soldQuantity,
      availableQuantity: entity.availableQuantity,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy ? entity.createdBy.id_usuario : null, 
    } as any;
  }
}