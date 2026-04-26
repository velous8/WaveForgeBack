import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';


@Injectable()
export class OrderService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async createOrder(email: string, packId: string) {
        //Получаем пользователя
        const user = await this.prisma.users.findFirst({
            where: {email: email}
        })
        if(!user) {
            throw new NotFoundException('User not found')
        }

        //Получаем пак
        const pack = await this.prisma.packs.findFirst({
            where: {id: packId, is_active: true}
        })
        if(!pack) {
            throw new NotFoundException('Pack not found')
        }

        //Проверяем не куплен ли заказ
        const existingOrder = await this.prisma.orders.findFirst({
            where: { user_id: user.id, pack_id: pack.id, status: 'paid'}
        });
        if (existingOrder) {
            throw new ConflictException('Order already exists');
        }
        
        return await this.prisma.$transaction(async () => {
            //Создаем заказ
            const order = await this.prisma.orders.create({
                data: {
                    pack_id: pack.id,
                    user_id: user.id
                }
            })

            //Возвращаем данные  
            return {
                orderId: order.id,
                amount: pack.price,
                currency: pack.currency,
                description: `Music pack "${pack.title}"`
            }
        })
    }

    async getOrders(email: string) {
        const orders = await this.prisma.orders.findMany({
            where:{
                users: {email: email},
                status: "paid"
            }
        })

        return orders.map(item => item.id)
    }
}
