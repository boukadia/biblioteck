import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateEmpruntDto {
  @IsNotEmpty({ message: "L'identifiant du livre (livreId) est obligatoire." })
  @IsInt({ message: 'Le livreId doit être un nombre entier.' })
  @Min(1, { message: "L'identifiant du livre doit être positif." })
  livreId: number;

  @IsOptional()
  @IsInt({ message: "L'identifiant du bonus doit être un nombre entier." })
  @Min(1)
  bonusPossedeId?: number;
}
