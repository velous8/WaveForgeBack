import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";


@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest()

        const apiKey = request.headers['x-admin-key']

        if(!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
            throw new UnauthorizedException('Invalid admin api key')
        }

        return true
    }
}