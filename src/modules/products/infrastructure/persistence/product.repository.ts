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
    const dataToSave: any = {
      ...productData,
    };

    // Si viene el ID del creador, lo convertimos al formato de objeto User
    if (productData.createdBy) {
      dataToSave.createdBy = { id_usuario: productData.createdBy };
    }

    // --- NUEVO: TRADUCCIÓN DE CATEGORÍA ---
    // Si viene el ID de categoría (número), lo convertimos al objeto Category { id: ... }
    if (productData.categoryId) {
      dataToSave.category = { id: productData.categoryId };
    }
    // --------------------------------------

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
      // ANTES (Comentado):
      // relations: ['createdBy'] 
      // AHORA (Agregamos category):
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
      // ANTES (Comentado):
      // relations: ['createdBy'] 
      // AHORA (Agregamos category):
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

  /**
   * MAPPER: Convierte de Entidad (BD) a Dominio (Puro)
   */
  private mapToDomain(entity: Product): ProductDomain {
    return {
      id: entity.id,
      name: entity.name,
      
      // --- MODIFICADO ---
      // ANTES (Comentado):
      // categoryId: entity.categoryId,
      
      // AHORA: Extraemos el ID del objeto category (si existe)
      categoryId: entity.category ? entity.category.id : null,
      // ------------------

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