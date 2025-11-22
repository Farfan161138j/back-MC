import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './infrastructure/entities/category.entity';
import { CategoriesController } from './infrastructure/controllers/categories.controller';

import { CategoryRepository } from './domain/category.repository';
import { TypeOrmCategoryRepository } from './infrastructure/persistence/category.repository';

// Servicios
import { CreateCategoryService } from './application/create-category/create-category.service';
import { GetAllCategoriesService } from './application/get-all-categories/get-all-categories.service';
import { DeleteCategoryService } from './application/delete-category/delete-category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
  ],
  controllers: [CategoriesController], // <--- Controller
  providers: [
    {
      provide: CategoryRepository,
      useClass: TypeOrmCategoryRepository,
    },
    // <--- Servicios
    CreateCategoryService,
    GetAllCategoriesService,
    DeleteCategoryService,
  ],
  exports: [CategoryRepository],
})
export class CategoriesModule {}