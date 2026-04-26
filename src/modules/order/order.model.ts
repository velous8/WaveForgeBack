import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { OrderService } from './order.service';

@Module({
    providers: [OrderService, PrismaService],
    exports: [OrderService]
})
export class OrderModule {}
