import { IsEmail, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  nom: string;
  @IsEmail()
  email: string;
  @IsString()
  prenom: string;
  @IsString()
  motDePasse: string;
}
