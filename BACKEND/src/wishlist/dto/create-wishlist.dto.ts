import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWishlistDto {
  @IsNumber({}, { message: "L'ID du livre doit être un nombre." })
  @IsNotEmpty({ message: "L'ID du livre est obligatoire." })
  livreId: number;
}