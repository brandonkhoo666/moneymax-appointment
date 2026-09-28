import { IsInt, Matches } from 'class-validator';
import { IsTodayOrAfter } from '../../validators/is-today-or-after-validator.js';

export class ListAppointmentSlotDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
  @IsTodayOrAfter()
  date: string;
}
