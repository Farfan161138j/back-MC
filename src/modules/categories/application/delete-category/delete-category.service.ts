import { Injectable, Inject } from '@nestjs/common';
import { CategoryRepository } from '../../domain/category.repository';

@Injectable()
export class DeleteCategoryService {
  constructor(
    @Inject(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}