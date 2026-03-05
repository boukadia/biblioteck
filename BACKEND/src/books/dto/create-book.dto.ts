import {
    IsInt,
    IsISBN,
    IsNotEmpty,
    IsOptional,
    IsPositive,
    IsString,
    Min,
} from 'class-validator';

export class CreateBookDto {
    @IsNotEmpty()
    @IsString()
    titre: string;

    @IsNotEmpty()
    @IsString()
    auteur: string;

    @IsNotEmpty()
    @IsString()
    isbn: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    stock?: number;

    @IsNotEmpty()
    @IsString()
    categorie: string;
}
