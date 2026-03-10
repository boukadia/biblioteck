
import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { StatutEmprunt } from '@prisma/client';
import { CreateEmpruntDto } from './create-emprunt.dto';

export class UpdateEmpruntDto extends PartialType(CreateEmpruntDto) {
    @IsOptional()
    @IsEnum(StatutEmprunt)
    statut?: StatutEmprunt;

    @IsOptional()
    @IsDateString()
    dateRetour?: string;
}
