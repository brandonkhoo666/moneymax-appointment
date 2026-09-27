import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class EditOperationalDayDto {
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  isActive: boolean;
}
