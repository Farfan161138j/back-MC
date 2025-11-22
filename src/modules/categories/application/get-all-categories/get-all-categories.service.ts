import { Injectable, Inject } from '@nestjs/common';
import { CategoryRepository, CategoryDomain } from '../../domain/category.repository';

@Injectable()
export class GetAllCategoriesService {
  constructor(
    @Inject(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(): Promise<CategoryDomain[]> {
    return this.categoryRepository.findAll();
  }
}