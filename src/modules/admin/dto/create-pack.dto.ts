import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Length, Min } from "class-validator"


export class CreatePackDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsInt()
    @Min(1)
    price: number

    @IsString()
    @Length(3, 3)
    currency: string

    @IsString()
    @IsNotEmpty()
    file_key: string

    @IsOptional()
    @IsBoolean() 
    is_active?: boolean
}