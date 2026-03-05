import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsPositive,
    IsString,
} from 'class-validator';
import { TypeMouvementPoints } from '@prisma/client';

export class CreateActiviteDto {
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    utilisateurId: number;

    @IsNotEmpty()
    @IsInt()
    montant: number; // Peut être négatif (perte) ou positif (gain)

    @IsNotEmpty()
    @IsEnum(TypeMouvementPoints)
    type: TypeMouvementPoints;

    @IsNotEmpty()
    @IsString()
    description: string;
}
