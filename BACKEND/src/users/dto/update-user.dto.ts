import { PartialType } from '@nestjs/mapped-types';
import { isEmpty } from 'rxjs';
import { IsEmail, IsOptional, IsString } from 'class-validator';


export class UpdateUserDto {
    @IsOptional()
    @IsString()
    nom?: string;
    @IsEmail()
    email?: string;
}
