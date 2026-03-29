import { IsInt, IsOptional, Min } from 'class-validator';

export class RetourEmpruntDto {
  @IsOptional()
  @IsInt({
    message: "L'identifiant du bonus de protection doit être un nombre entier.",
  })
  @Min(1)
  bonusProtectionId?: number;
}
