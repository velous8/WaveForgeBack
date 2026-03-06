import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { OrderService } from './order.service';
import { YooKassaService } from '../payment/yookassa.service';

@Module({
    providers: [OrderService, PrismaService, YooKassaService],
    exports: [OrderService]
})
export class OrderModule {}
