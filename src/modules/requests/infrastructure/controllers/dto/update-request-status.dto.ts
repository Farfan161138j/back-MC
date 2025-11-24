import { IsInt, IsPositive } from 'class-validator';

export class UpdateRequestStatusDto {
  @IsInt()
  @IsPositive()
  statusId: number;
}