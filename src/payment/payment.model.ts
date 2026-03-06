import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { YooKassaService } from './yookassa.service';
import { DownloadModule } from 'src/dawnlad/dawnload.model';
import { DownloadService } from 'src/dawnlad/dawnload.service';
import { S3Service } from 'src/dawnlad/s3.service';
import { EmailService } from 'src/email.service';

@Module({
  imports: [DownloadModule],
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService, YooKassaService, DownloadService, S3Service, EmailService],
})
export class PaymentModule {}
