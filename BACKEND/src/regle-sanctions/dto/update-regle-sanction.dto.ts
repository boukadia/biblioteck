import { PartialType } from '@nestjs/mapped-types';
import { CreateRegleSanctionDto } from './create-regle-sanction.dto';

export class UpdateRegleSanctionDto extends PartialType(
  CreateRegleSanctionDto,
) {}
