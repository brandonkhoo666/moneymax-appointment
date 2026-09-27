import { IsInt, IsString, Min } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  title: string;

  @IsInt()
  @Min(5)
  durationInMinute: number;

  @IsInt()
  @Min(1)
  maxBookingPerTimeSlot: number;
}
