import { PartialType } from '@nestjs/mapped-types';
import { CreateBorrowDto } from './create-borrow.dto';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { StatutEmprunt } from '@prisma/client';

export class UpdateBorrowDto extends PartialType(CreateBorrowDto) {
    @IsOptional()
    @IsEnum(StatutEmprunt)
    statut?: StatutEmprunt;

    @IsOptional()
    @IsDateString()
    dateRetour?: string;
}
