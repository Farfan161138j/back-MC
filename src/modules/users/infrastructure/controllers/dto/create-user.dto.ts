import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';


export class CreateUserDto{

   @IsEmail()
   @IsNotEmpty()
    email: string; 


    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsOptional()
    @IsString()
    apellidoPaterno?: string;

    @IsString()
    @IsOptional()
    apellidoMaterno?: string;

    @IsString()
    @MinLength(6,{message:'La contraseña debe de tener al menos 6 caracteres'})
    @IsNotEmpty()
    password: string;

    @IsString()
  @IsOptional()
  whatsappNumber?: string;

    @IsNumber()
    @IsNotEmpty()
    idRol: number;

}