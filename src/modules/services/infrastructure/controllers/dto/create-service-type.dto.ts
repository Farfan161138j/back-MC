import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateServiceTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}