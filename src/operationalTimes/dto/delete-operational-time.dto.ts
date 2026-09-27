import { IsInt } from 'class-validator';

export class DeleteOperationalTimeDto {
  @IsInt()
  id: number;
}
