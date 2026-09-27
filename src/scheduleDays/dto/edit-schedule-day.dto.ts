import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class EditScheduleDayDto {
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  isActive: boolean;
}
