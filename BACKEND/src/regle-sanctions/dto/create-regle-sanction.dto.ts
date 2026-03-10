import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateRegleSanctionDto {
    @IsNotEmpty()
    @IsString()
    nomRegle: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    penalitePoints: number;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    dureeBlocage: number;
}
