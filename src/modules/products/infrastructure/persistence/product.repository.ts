// src/modules/products/infrastructure/persistence/product.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity'; // La Entidad (Tabla)
import { ProductRepository, ProductDomain } from '../../domain/product.repository'; // El Contrato

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
  
  constructor(
    @InjectRepository(Product)
    private readonly ormRepo: Repository<Product>,
  ) {}

  /**
   * Guardar o Actualizar un producto
   */
  async save(productData: Partial<ProductDomain>): Promise<ProductDomain> {
    
    // 1. CORRECCIÓN: Preparamos los datos
    // TypeORM espera un objeto para la relación, no un número.
    const dataToSave: any = {
      ...productData,
    };

    // Si viene el ID del creador, lo convertimos al formato de objeto User
    // { id_usuario: 5 } es lo que TypeORM entiende para vincular la FK.
    if (productData.createdBy) {
      dataToSave.createdBy = { id_usuario: productData.createdBy };
    }

    // 2. Guardamos en la BD
    const savedProduct = await this.ormRepo.save(dataToSave);
    
    return this.mapToDomain(savedProduct);
  }

  /**
   * Buscar todos (con paginación)
   */
  async findAll(page: number, limit: number): Promise<ProductDomain[]> {
    const skip = (page - 1) * limit;
    
    const products = await this.ormRepo.find({
      skip: skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['createdBy'] // Opcional: Si quieres traer quién lo creó
    });

    return products.map(product => this.mapToDomain(product));
  }

  /**
   * Buscar por ID
   */
  async findById(id: number): Promise<ProductDomain | null> {
    const product = await this.ormRepo.findOne({ 
      where: { id },
      relations: ['createdBy'] // Cargamos la relación para poder mapearla
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

  /**
   * MAPPER: Convierte de Entidad (BD) a Dominio (Puro)
   */
  private mapToDomain(entity: Product): ProductDomain {
    return {
      id: entity.id,
      name: entity.name,
      categoryId: entity.categoryId,
      description: entity.description,
      image: entity.image,
      soldQuantity: entity.soldQuantity,
      availableQuantity: entity.availableQuantity,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      // Mapeamos el objeto User a solo su ID numérico
      createdBy: entity.createdBy ? entity.createdBy.id_usuario : null, 
    } as ProductDomain;
  }
}