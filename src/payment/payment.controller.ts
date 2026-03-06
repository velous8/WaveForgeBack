import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { PaymentService } from './payment.service';



@Controller('payment')
export class PaymentController {
    constructor(
        private readonly PaymentService: PaymentService,
    ) {}

    @Post()
    @HttpCode(200)
    async paymentWebhook(@Body() body: object){   
        await this.PaymentService.paymentWebhook(body)
        return {status: "ok"}
    }
}
