import {
    IsDateString,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsPositive,
} from 'class-validator';
import { StatutEmprunt } from '@prisma/client';

export class CreateBorrowDto {
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    utilisateurId: number;

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    livreId: number;

    @IsNotEmpty()
    @IsDateString()
    dateEcheance: string;

    @IsOptional()
    @IsEnum(StatutEmprunt)
    statut?: StatutEmprunt;
}
