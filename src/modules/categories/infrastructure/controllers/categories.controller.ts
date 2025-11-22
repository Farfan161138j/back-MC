import { 
  Controller, Post, Body, Get, Delete, Param, 
  UseGuards, HttpCode, HttpStatus, ParseIntPipe 
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';

// Servicios
import { CreateCategoryService } from '../../application/create-category/create-category.service';
import { GetAllCategoriesService } from '../../application/get-all-categories/get-all-categories.service';
import { DeleteCategoryService } from '../../application/delete-category/delete-category.service';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly createService: CreateCategoryService,
    private readonly getAllService: GetAllCategoriesService,
    private readonly deleteService: DeleteCategoryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Protegido
  async create(@Body() dto: CreateCategoryDto) {
    return this.createService.execute(dto);
  }

  @Get()
  async findAll() {
    return this.getAllService.execute();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard) // Protegido
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteService.execute(id);
  }
}