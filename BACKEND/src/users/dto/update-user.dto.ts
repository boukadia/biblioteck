import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Min,
    MinLength,
} from 'class-validator';
import { StatutUtilisateur } from '@prisma/client';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsString()
    @MinLength(6)
    motDePasse?: string;

    @IsOptional()
    @IsEnum(StatutUtilisateur)
    statut?: StatutUtilisateur;

    // @IsOptional()
    // @IsInt()
    // @Min(1)
    // niveau?: number;

    // @IsOptional()
    // @IsInt()
    // @Min(0)
    // xp?: number;

    // @IsOptional()
    // @IsInt()
    // @Min(0)
    // pointsActuels?: number;
}
