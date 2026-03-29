import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @IsOptional()
  @IsBoolean()
  estConsomme?: boolean;

  @IsOptional()
  @IsDateString()
  dateUtilisation?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  empruntId?: number;
}
