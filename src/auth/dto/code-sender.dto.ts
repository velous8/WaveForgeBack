import { IsEmail, IsUUID } from "class-validator"

export class CodeSendDto {
    @IsEmail()
    email: string
    
    @IsUUID()
    packId: string
}