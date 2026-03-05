import { IsArray, IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateWishlistDto {
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @IsPositive({ each: true })
    livreIds?: number[];
}
