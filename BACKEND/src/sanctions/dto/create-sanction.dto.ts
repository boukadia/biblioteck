import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateSanctionDto {
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    utilisateurId: number;

    @IsNotEmpty()
    @IsString()
    raison: string;

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    penalitePoints: number;

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    dureeBlocage: number;
}
