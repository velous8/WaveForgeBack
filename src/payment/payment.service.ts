import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { YooKassaService } from './yookassa.service';
import { DownloadService } from 'src/dawnlad/dawnload.service';
import { EmailService } from 'src/email.service';


@Injectable()
export class PaymentService {
    constructor(
        private readonly prisma: PrismaService, 
        private readonly yooKassa: YooKassaService,
        private readonly downloadService: DownloadService,
        private readonly email: EmailService
    ) {}

    async paymentWebhook(body) {
        const yookassaEventId = body.object.id
        const yookassaEventType = body.event
        const yookassaOrderId = body.object.metadata.order_id;
        
        //Проверка входящих данных
        if(!yookassaEventId || !yookassaEventType || !yookassaOrderId) {
            return
        }
    
        //Защита от повторов
        const exist = await this.prisma.payment_webhooks.findFirst({
            where: {
                event_id: yookassaEventId
            }
        })
        if(exist) {
            return
        }  
        
        try {    
            //Запрашиваем eventId у юкассы
            const payment = await this.yooKassa.getPayment(yookassaEventId);

            //Проверка заказа
            const order = await this.prisma.orders.findUnique({
                where:{id: yookassaOrderId}
            })       
            if(!order || order.status !== 'pending') {
                return
            }

            //Поиск пользователя
            const user = await this.prisma.users.findFirst({
                where:{id: order.user_id},
                select:{email:true}
            })
            if(!user) {
                return
            }

            //Поиск пака
            const pack = await this.prisma.packs.findFirst({
                where: {id: order.pack_id}
            })
            if(!pack) {
                return
            }

            //Проверка данных на соответствие
            if(payment.status !== 'succeeded' ||
                Number(payment.amount.value) !== pack.price ||
                payment.amount.currency !== pack.currency ||
                payment.metadata.order_id !== order.id
            ) {
                await this.prisma.payment_webhooks.create({
                    data: {
                        order_id: yookassaOrderId,
                        event_type: 'payment.data_mismatch',
                        event_id: yookassaEventId,
                        payload: body, 
                    }
                })
                return
            }

            //Итоговая транзакция
            await this.prisma.$transaction(async () => {
                //Генерируем ссылку
                const url = await this.downloadService.createDownloadLink([order.id])
                if(!url) {
                    return
                }

                //Отправляем ссылку
                await this.email.emailSender(user.email, "Ссылки на скачивание", url.join())

                //Создаем payment
                await this.prisma.payment_webhooks.create({
                    data: {
                       order_id: yookassaOrderId,
                       event_type: yookassaEventType,
                       event_id: yookassaEventId,
                       payload: body, 
                    }
                })

                //Подтверждаем заказ
                await this.prisma.orders.update({
                    where: {id: yookassaOrderId},
                    data: {
                        status: 'paid',
                        paid_at: new Date(),
                    }
                })
            })   
        } catch (error) {
            await this.prisma.payment_webhooks.create({
                data: {
                    order_id: yookassaOrderId,
                    event_type: 'payment.fetch_error',
                    event_id: yookassaEventId,
                    payload: body
                }
            })
            console.log(error)
            return 
        }    
    }
}
