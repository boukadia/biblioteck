import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateBadgeDto {
  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  conditionXP: number;
}
