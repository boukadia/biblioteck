import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsPositive,
    IsString,
} from 'class-validator';
import { TypeRecompense } from '@prisma/client';

export class CreateRecompenseDto {
    @IsNotEmpty()
    @IsString()
    nom: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    cout: number;

    @IsNotEmpty()
    @IsEnum(TypeRecompense)
    type: TypeRecompense;

    @IsOptional()
    @IsInt()
    @IsPositive()
    dureeValiditeJours?: number;
}
