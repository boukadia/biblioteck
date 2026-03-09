import { PartialType } from '@nestjs/mapped-types';
import { CreateRecompenseDto } from './create-shop.dto';

export class UpdateRecompenseDto extends PartialType(CreateRecompenseDto) { }
