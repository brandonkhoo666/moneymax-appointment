import { IsEmail, IsInt, IsString, Matches } from 'class-validator';
import { IsValidTime } from '../../validators/is-valid-time-validator.js';
import { IsTodayOrAfter } from '../../validators/is-today-or-after-validator.js';

export class MakeBookingDto {
  @IsInt()
  appointmentId: number;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
  @IsTodayOrAfter()
  date: string;

  @IsValidTime()
  startTime: string;

  @IsString()
  attendeeName: string;

  @IsEmail()
  attendeeEmail: string;
}
