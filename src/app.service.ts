import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth/auth.service";
import { BuyPackDto } from "./dto/buy-pack.dto";
import { OrderService } from "./order/order.service";
import { YooKassaService } from "./payment/yookassa.service";
import { RelinkDto } from "./dto/relink.dto";
import { DownloadService } from "./dawnlad/dawnload.service";
import { EmailService } from "./email.service";

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
        const verified = await this.authService.codeCheck(dto.email, dto.code)
        if(!verified) {
            return "error"
        }

        const order = await this.orderService.createOrder(dto.email, dto.packId)
        if(!order) {
            return "error"
        }

        const yooKassaPayment = await this.yooKassaService.createPayment({
            orderId: order.orderId,
            amount: order.amount,
            currency: 'RUB',
            description: order.description
        })

        return yooKassaPayment
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
    }
}