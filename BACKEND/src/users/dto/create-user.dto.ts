import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';
import { RoleUtilisateur, StatutUtilisateur } from '@prisma/client';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    nom: string;

    @IsOptional()
    @IsString()
    prenom?: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    motDePasse: string;

    @IsOptional()
    @IsEnum(RoleUtilisateur)
    role?: RoleUtilisateur;

    @IsOptional()
    @IsEnum(StatutUtilisateur)
    statut?: StatutUtilisateur;
}
