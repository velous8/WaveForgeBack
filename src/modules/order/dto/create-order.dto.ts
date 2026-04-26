import { IsEmail, IsString, IsUUID } from "class-validator";

export class CreateOrderDto {
    @IsEmail()
    email: string

    @IsUUID()
    packId: string
}