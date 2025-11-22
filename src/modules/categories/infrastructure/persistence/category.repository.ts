import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CategoryRepository, CategoryDomain } from '../../domain/category.repository';

@Injectable()
export class TypeOrmCategoryRepository implements CategoryRepository {
  
  constructor(
    @InjectRepository(Category)
    private readonly ormRepo: Repository<Category>,
  ) {}

  async save(categoryData: Partial<CategoryDomain>): Promise<CategoryDomain> {
    const savedCategory = await this.ormRepo.save(categoryData);
    return this.mapToDomain(savedCategory);
  }

  async findAll(): Promise<CategoryDomain[]> {
    const categories = await this.ormRepo.find({
      order: { name: 'ASC' }, // Orden alfabético es mejor para categorías
    });
    return categories.map(cat => this.mapToDomain(cat));
  }

  async findById(id: number): Promise<CategoryDomain | null> {
    const category = await this.ormRepo.findOne({ where: { id } });
    return category ? this.mapToDomain(category) : null;
  }

  async findByName(name: string): Promise<CategoryDomain | null> {
    const category = await this.ormRepo.findOne({ where: { name } });
    return category ? this.mapToDomain(category) : null;
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete(id);
  }

  private mapToDomain(entity: Category): CategoryDomain {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}