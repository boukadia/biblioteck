import { IsNumber } from 'class-validator';

export class ProlongerEmpruntDto {
  @IsNumber()
  bonusPossedeId: number;
}
