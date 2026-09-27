import { IsInt } from 'class-validator';

export class DeleteUnavailableDateDto {
  @IsInt()
  id: number;
}
