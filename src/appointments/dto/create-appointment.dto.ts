import { IsInt, IsString, Max, Min } from 'class-validator';
import { APPOINTMENT_CONFIG } from '../../configs/appointment.config.js';

export class CreateAppointmentDto {
  @IsString()
  title: string;

  @IsInt()
  @Min(APPOINTMENT_CONFIG.minSlotDuration)
  durationInMinute: number;

  @IsInt()
  @Min(1)
  @Max(5)
  maxBookingPerTimeSlot: number;
}
