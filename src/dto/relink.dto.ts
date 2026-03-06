import { IsEmail, Length } from "class-validator"

export class RelinkDto {
    @IsEmail()
    email: string

    @Length(6, 6)
    code: string
}   
