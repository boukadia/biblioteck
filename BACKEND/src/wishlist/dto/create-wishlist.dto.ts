import { IsArray, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateWishlistDto {
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    utilisateurId: number;

    @IsArray()
    @IsInt({ each: true })
    @IsPositive({ each: true })
    livreIds: number[];
}
