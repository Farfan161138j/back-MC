import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional() // <-- CAMBIO: Ahora es opcional
  email?: string; // <-- CAMBIO: Se añade '?'

  @IsString()
  @IsOptional() // <-- CAMBIO: Ahora es opcional
  nombre?: string; // <-- CAMBIO: Se añade '?'

  @IsOptional()
  @IsString()
  apellidoPaterno?: string; // (Este ya estaba bien)

  @IsString()
  @IsOptional()
  apellidoMaterno?: string; // (Este ya estaba bien)

  @IsString()
  @MinLength(6, { message: 'La contraseña debe de tener al menos 6 caracteres' })
  @IsOptional() // <-- CAMBIO: Ahora es opcional
  password?: string; // <-- CAMBIO: Se añade '?'

  @IsNumber()
  @IsOptional() // <-- CAMBIO: Ahora es opcional
  idRol?: number; // <-- CAMBIO: Se añade '?'
}