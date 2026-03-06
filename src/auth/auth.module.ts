import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailService } from 'src/email.service';


@Module({
    controllers: [AuthController],
    providers: [AuthService, PrismaService, EmailService],
    exports: [AuthService]
})
export class AuthModule {}
