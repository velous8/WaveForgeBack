import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { PrismaService } from 'src/shared/prisma/prisma.service';

import { CodeSendDto } from './dto/code-sender.dto';
import { EmailService } from 'src/shared/email/email.service';

@Injectable()
export class AuthService {
    constructor (
        private readonly prisma: PrismaService,
        private readonly email: EmailService
    ) {}

    async codeSender(dto: CodeSendDto) {        
        //Ищем или создаем пользователя
        const user = await this.prisma.users.upsert({
            where:{email: dto.email},
            update:{},
            create:{email: dto.email}
        })
        try {  
            //Защита от повторной покупки
            const orderCheck = await this.prisma.orders.findFirst({
                where:{AND: [{user_id: user.id}, {pack_id: dto.packId}, {status:'paid'}]}
            })
            if(orderCheck) {
                throw new Error(`Этот пак уже заригестрирован на это email: ${orderCheck}`);
            }

            //Генерируем код подтверждения
            const code = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");

            //Если код существует и валиден, то обновляем. Иначе создаем новый
            const verified = await this.prisma.verifications.findFirst({
                where: {AND: [{user_id: user.id}, {status: 'pending'}]}
            })
            if(verified) {
                await this.prisma.verifications.update({
                    where: {id: verified.id},
                    data: {
                        code: code,
                        expires_at: new Date(Date.now() + 5*60*1000)
                    }
                })
            } else {
                await this.prisma.verifications.create({
                    data:{
                        user_id: user.id,
                        code: code,
                        expires_at: new Date(Date.now() + 5*60*1000)
                    }
                })
            }

            //Отправляем код на почту    
            await this.email.emailSender(dto.email, "Код подтверждения", code)

            return {message: `Код подтверждения отправлен на ${dto.email}`, send: true};
        } catch (error) {
            return error;
        }
    }

    async codeCheck(email: string, code: string) {  
        try { 
            //Ищем пользователя 
            const user = await this.prisma.users.findFirst({
                where: {email: email} 
            }) 
            if(!user) {
                throw new Error('Пользователь не найден');
            }

            //Проверяем код на валидность
            const verification = await this.prisma.verifications.findFirst({
                where:{AND: [{user_id: user.id}, {code: code}]}
            })
            if(!verification){
                throw new Error('Неверный код подтверждения');
            }   
            if(verification.expires_at < new Date()) {
                throw new Error('Срок действия кода истек');
            }
            if(verification.counter_try > verification.max_try) {
                throw new Error('Превышен лимит попыток');
            }

            //Подтверждаем код
            await this.prisma.verifications.update({
                where:{id: verification.id},
                data:{status:"varified"}
            })

            return {isValid: true};
        } catch (error) {
            return error;
        }
    }
}
