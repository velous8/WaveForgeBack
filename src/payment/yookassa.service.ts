import { ICapturePayment, YooCheckout } from '@a2seven/yoo-checkout';
import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';


@Injectable()
export class YooKassaService {
    private checkout: YooCheckout
    constructor() {
        this.checkout = new YooCheckout({
            shopId: process.env.SHOP_ID!,
            secretKey: process.env.YOOCASSA_SECRET_KEY! 
        });
    }
    async createPayment(order: {orderId: string, amount: number, currency: string, description: string}) {

        return this.checkout.createPayment({
            amount: {
                value: `${order.amount.toString()}.00`,
                currency: order.currency
            },
            capture: true,
            confirmation: {
                type: 'redirect',
                return_url: 'https://github.com/a2seven/yoocheckout/tree/dev' //Заглушка
            },
            description:order.description,
            metadata: {
                order_id: order.orderId
            }
        }, randomUUID());
    }

    async getPayment(paymentId: string) {
        return this.checkout.getPayment(paymentId)
    }
}
