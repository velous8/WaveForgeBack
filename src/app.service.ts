import { Injectable } from "@nestjs/common";
import { AuthService } from "./modules/auth/auth.service";
import { BuyPackDto } from "./dto/buy-pack.dto";
import { OrderService } from "./modules/order/order.service";
import { YooKassaService } from "./shared/yookassa/yookassa.service";
import { RelinkDto } from "./dto/relink.dto";
import { DownloadService } from "./modules/dawnlad/dawnload.service";
import { EmailService } from "./shared/email/email.service";

@Injectable()
export class AppService {
    constructor(
        private readonly authService: AuthService,
        private readonly orderService: OrderService,
        private readonly yooKassaService: YooKassaService,
        private readonly downloadService: DownloadService,
        private readonly email: EmailService
    ) {}

    async buyPack(dto: BuyPackDto) {
        try {
            //Проверяем код
            const verified = await this.authService.codeCheck(dto.email, dto.code)
            if(!verified) {
                throw new Error('Не верный код');
            }
            
            //Создаем заказ
            const order = await this.orderService.createOrder(dto.email, dto.packId)
            if(!order) {
                throw new Error('Заказ не создан');
            }

            //Создаем платеж в Юкассе
            const yooKassaPayment = await this.yooKassaService.createPayment({
                orderId: order.orderId,
                amount: order.amount,
                currency: 'RUB',
                description: order.description
            })
            if(!yooKassaPayment) {
                throw new Error('Платеж не создан');
            }

            //Возвращаем ссылку на оплату
            return yooKassaPayment.confirmation
        } catch (error) {
            return error
        }
        
    }

    async relink(dto: RelinkDto) {
        const verified = await this.authService.codeCheck(dto.email, dto.code)
        if(!verified) {
            return "error"
        }

        const orders = await (await this.orderService.getOrders(dto.email))
        if(!orders) {
            return
        }
        
        const urls = await this.downloadService.createDownloadLink(orders)
        if(!urls) {
            return
        }

        await this.email.emailSender(dto.email, "Relink", urls.join())
        return {message: 'Ссылки отправлены повторно'}
    }
}