import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, Min } from 'class-validator';
import { TypeRecompense } from '@prisma/client';

export class CreateRecompenseDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom de la récompense est obligatoire.' })
  nom: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0, { message: 'Le coût en points ne peut pas être négatif.' })
  cout: number;

  @IsEnum(TypeRecompense, { message: 'Le type de récompense n\'est pas valide.' })
  type: TypeRecompense;

  @IsNumber()
  @Min(1)
  @IsOptional()
  dureeValiditeJours?: number; 
}