import {
    IsInt,
    IsNotEmpty,
    IsPositive,
} from 'class-validator';

export class CreateEmpruntDto {
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    livreId: number;
}
