import { IsInt } from 'class-validator';

export class DeleteScheduleTimeDto {
  @IsInt()
  id: number;
}
