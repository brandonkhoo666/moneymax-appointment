import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateScheduleDayDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  isActive: boolean;
}
