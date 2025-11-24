import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class CreateRequestItemDto {
  @IsInt()
  @IsPositive()
  quantity: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  productId?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  serviceId?: number;
}