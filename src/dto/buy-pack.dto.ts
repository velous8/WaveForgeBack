import { IsEmail, IsUUID, Length } from "class-validator"

export class BuyPackDto {
    @IsEmail()
    email: string
    
    @IsUUID()
    packId: string

    @Length(6, 6)
    code: string
}   
