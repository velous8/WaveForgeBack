import { Module } from '@nestjs/common';

import { PrismaService } from 'src/shared/prisma/prisma.service';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { YooKassaService } from '../../shared/yookassa/yookassa.service';
import { DownloadModule } from 'src/modules/dawnlad/dawnload.model';
import { EmailService } from 'src/shared/email/email.service';

@Module({
  imports: [DownloadModule],
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService, YooKassaService, EmailService],
})
export class PaymentModule {}
