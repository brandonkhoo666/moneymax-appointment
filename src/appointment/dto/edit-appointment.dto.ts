import { IsInt, IsString, Min } from 'class-validator';

export class EditAppointmentDto {
  @IsInt()
  id: number;

  @IsString()
  title: string;

  @IsInt()
  @Min(5)
  durationInMinute: number;

  @IsInt()
  @Min(1)
  maxBookingPerTimeSlot: number;
}
