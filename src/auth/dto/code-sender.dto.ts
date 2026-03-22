import { IsEmail, IsUUID } from "class-validator";

export class CodeSendDto {
    @IsEmail({}, { message: 'Некорректный формат email' })
    email: string;
    
    @IsUUID('all', { message: 'Некорректный формат packId' })
    packId: string;
}