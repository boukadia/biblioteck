import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  utilisateurId: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  recompenseId: number;

  @IsOptional()
  @IsBoolean()
  estConsomme?: boolean;

  @IsOptional()
  @IsDateString()
  dateExpiration?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  empruntId?: number;
}
