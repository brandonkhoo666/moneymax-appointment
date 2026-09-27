import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { IsValidTime } from '../../validators/is-valid-time-validator.js';

export class EditScheduleTimeDto {
  @IsInt()
  id: number;

  @IsValidTime()
  from: string;

  @IsValidTime()
  to: string;

  @IsBoolean()
  isAvailable: boolean;

  @IsOptional()
  @IsString()
  remarks: string | null;
}
