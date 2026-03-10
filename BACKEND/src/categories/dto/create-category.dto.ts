import { IsString } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    description:string
    @IsString()
    name:string
}
