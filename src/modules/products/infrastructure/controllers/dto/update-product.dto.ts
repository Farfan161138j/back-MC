import { PartialType } from '@nestjs/mapped-types'; // Necesitas instalar esto o @nestjs/swagger
import { CreateProductDto } from './create-product.dto';

// PartialType hace que todas las propiedades de CreateProductDto sean opcionales
export class UpdateProductDto extends PartialType(CreateProductDto) {}