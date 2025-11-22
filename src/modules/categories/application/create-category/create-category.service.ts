import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { CategoryRepository, CategoryDomain } from '../../domain/category.repository';
import { CreateCategoryDto } from '../../infrastructure/controllers/dto/create-category.dto';

@Injectable()
export class CreateCategoryService {
  constructor(
    @Inject(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(dto: CreateCategoryDto): Promise<CategoryDomain> {
    // Regla de Negocio: No repetir nombres
    const existing = await this.categoryRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictException(`La categoría '${dto.name}' ya existe.`);
    }

    return this.categoryRepository.save({
      name: dto.name,
      description: dto.description,
      isActive: true,
    });
  }
}