import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class AppliquerSanctionDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  utilisateurId: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  regleId: number;
}
