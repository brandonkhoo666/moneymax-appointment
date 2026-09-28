import { IsDate, IsOptional, IsString, Matches } from 'class-validator';
import { IsTodayOrAfter } from '../../validators/is-today-or-after-validator.js';

export class CreateUnavailableDateDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
  @IsTodayOrAfter()
  date: string;

  @IsString()
  remarks: string;
}
