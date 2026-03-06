import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma.service';
import { CodeSendDto } from './dto/code-sender.dto';
import { EmailService } from 'src/email.service';

@Injectable()
export class AuthService {
    constructor (
        private readonly prisma: PrismaService,
        private readonly email: EmailService
    ) {}

    async codeSender(dto: CodeSendDto) {    
        const user = await this.prisma.users.upsert({
            where:{email: dto.email},
            update:{},
            create:{email: dto.email}
        })
        
        const orderCheck = await this.prisma.orders.findFirst({
            where:{AND: [{user_id: user.id}, {pack_id: dto.packId}, {status:'paid'}]}
        })
        if(orderCheck) {
            return {message: `Этот пак уже заригестрирован на это email: ${orderCheck}`};
        }

        const code = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");

        const verified = await this.prisma.verifications.findFirst({
            where: {AND: [{user_id: user.id}, {status: 'pending'}]}
        })
        if(verified) {
            await this.prisma.verifications.update({
                where: {id: verified.id},
                data: {
                    code: code,
                    expires_at: new Date(Date.now() + 360*24*60*60*1000) //Сделать жизнь кода 5 минут!!!! (5*60*1000)
                }
            })
        } else {
            await this.prisma.verifications.create({
                data:{
                    user_id: user.id,
                    code: code,
                    expires_at: new Date(Date.now() + 360*24*60*60*1000) //Сделать жизнь кода 5 минут!!!! (5*60*1000)
                }
            })
        }

        

        try {    
            await this.email.emailSender(dto.email, "Код подтверждения", code)
            return {message: `Код подтверждения отправлен на ${dto.email}`};
        } catch (error) {
            throw new InternalServerErrorException('Ошибка при отправке email');
        }
    }

    async codeCheck(email: string, code: string) {   
        const user = await this.prisma.users.findFirst({
            where: {email: email} 
        }) 
        if(!user) {
            throw new BadRequestException('Пользователь не найден');
        }

        const verification = await this.prisma.verifications.findFirst({
            where:{AND: [{user_id: user?.id}, {code: code}]}
        })
        if(!verification){
            throw new BadRequestException('Неверный код подтверждения');
        }   
        if(verification.expires_at < new Date()) {
            throw new BadRequestException('Срок действия кода истек');
        }
        if(verification.counter_try > verification.max_try) {
            throw new BadRequestException('Превышен лимит попыток');
        }

        try {   
            await this.prisma.verifications.update({
                where:{id: verification.id},
                data:{status:"varified"}
            })

            return true;
        } catch (error) {
             throw new InternalServerErrorException('Ошибка при подтверждении кода');
        }
    }
}
