import { IsString, IsOptional, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRequestItemDto } from './create-request-item.dto';

export class CreateRequestDto {
  
  @IsString()
  @IsOptional()
  clientMessage?: string;

  @IsArray()
  @ArrayMinSize(1) // Al menos 1 producto/servicio
  @ValidateNested({ each: true }) // Valida cada item dentro del array
  @Type(() => CreateRequestItemDto) // Convierte el JSON a la clase ItemDto
  items: CreateRequestItemDto[];
}