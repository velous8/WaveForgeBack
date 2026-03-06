import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CodeSendDto } from "./dto/code-sender.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('code-generate')
    codeSender(@Body() dto: CodeSendDto){
        return this.authService.codeSender(dto)
    }
}
