import { IsString, IsNumber, IsOptional, IsPositive, IsBoolean } from 'class-validator';

export class CreateServiceDto {
  
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional() // Puede ser null si es "A cotizar"
  price?: number;

  @IsNumber()
  serviceTypeId: number; // El ID del tipo (Mantenimiento, Capacitación, etc.)
  
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}