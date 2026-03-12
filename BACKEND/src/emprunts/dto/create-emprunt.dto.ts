import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsPositive,
} from 'class-validator';

export class CreateEmpruntDto {
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    livreId: number;
    
    @IsInt()
  @IsOptional() // Optionnel : y9der y-st3mel bonus, y9der la
  bonusPossedeId?: number;
}
