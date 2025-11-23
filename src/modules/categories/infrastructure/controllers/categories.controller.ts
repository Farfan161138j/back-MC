import { 
  Controller, Post, Body, Get, Delete, Param, 
  UseGuards, HttpCode, HttpStatus, ParseIntPipe 
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';

// 1. IMPORTS NUEVOS DE SEGURIDAD
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { RoleEnum } from '../../../users/domain/roles.enum';

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

  // --- CREAR (SOLO ADMIN) ---
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // <--- Agregamos RolesGuard
  @Roles(RoleEnum.ADMIN)               // <--- Solo Admin puede crear categorías
  async create(@Body() dto: CreateCategoryDto) {
    return this.createService.execute(dto);
  }

  // --- LEER TODAS (Público) ---
  @Get()
  // Sin @Roles, cualquiera puede ver la lista
  async findAll() {
    return this.getAllService.execute();
  }

  // --- BORRAR (SOLO ADMIN) ---
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard) // <--- Agregamos RolesGuard
  @Roles(RoleEnum.ADMIN)               // <--- Solo Admin puede borrar
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteService.execute(id);
  }
}