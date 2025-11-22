import { IsNotEmpty, IsString, IsInt, IsOptional, Min, IsUrl } from 'class-validator';

export class CreateProductDto {
  
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  name: string;

  @IsInt({ message: 'El ID de categoría debe ser un número entero' })
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  categoryId: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  // @IsUrl() // Descomenta si quieres validar que sea una URL real
  image?: string;

  @IsInt()
  @Min(0, { message: 'La cantidad disponible no puede ser negativa' })
  @IsOptional()
  availableQuantity?: number;
}