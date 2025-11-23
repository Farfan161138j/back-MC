import { 
  Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus,
  Get, Param, ParseIntPipe, Query, Patch, Delete
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';

// Imports de Seguridad
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { RoleEnum } from '../../../users/domain/roles.enum';

// Servicios
import { CreateProductService } from '../../application/create-product/create-product.service';
import { GetAllProductsService } from '../../application/get-all-products/get-all-products.service';
import { GetProductByIdService } from '../../application/get-product-by-id/get-product-by-id.service';
import { UpdateProductService } from '../../application/update-product/update-product.service';
import { DeleteProductService } from '../../application/delete-product/delete-product.service';

// DTOs
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  
  constructor(
    private readonly createProductService: CreateProductService,
    private readonly getAllProductsService: GetAllProductsService,
    private readonly getProductByIdService: GetProductByIdService,
    private readonly updateProductService: UpdateProductService,
    private readonly deleteProductService: DeleteProductService,
  ) {}

  // --- CREAR (SOLO ADMIN) ---
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard) // 1. Agregamos al Portero de Roles
  @Roles(RoleEnum.ADMIN)               // 2. Etiqueta: "Solo pasa Rol Admin"
  async create(@Body() createProductDto: CreateProductDto, @Request() req) {
    return this.createProductService.execute(createProductDto, req.user.id);
  }

  // --- LEER TODOS (Público) ---
  @Get()
  @HttpCode(HttpStatus.OK)
  // Sin Guards ni Roles = Cualquiera puede ver
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.getAllProductsService.execute(Number(page), Number(limit));
  }

  // --- LEER UNO (Público) ---
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getProductByIdService.execute(id);
  }

  // --- ACTUALIZAR (SOLO ADMIN) ---
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard) // 1. Agregamos al Portero de Roles
  @Roles(RoleEnum.ADMIN)               // 2. Etiqueta: "Solo pasa Rol Admin"
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.updateProductService.execute(id, updateProductDto);
  }

  // --- BORRAR (SOLO ADMIN) ---
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard) // 1. Agregamos al Portero de Roles
  @Roles(RoleEnum.ADMIN)               // 2. Etiqueta: "Solo pasa Rol Admin"
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteProductService.execute(id);
    return;
  }
}