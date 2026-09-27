import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateOperationalDayDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  isActive: boolean;
}
