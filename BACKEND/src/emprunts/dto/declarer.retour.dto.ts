import { IsInt, IsOptional, Min } from 'class-validator';

export class DeclarerRetourDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  bonusProtectionId?: number;
}