import { IsInt, IsNotEmpty } from "class-validator";

export class changeStockDto {
    @IsInt()
    @IsNotEmpty()
    quantity:number
}