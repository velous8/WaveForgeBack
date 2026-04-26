// import { Module } from '@nestjs/common';
// import { AdminModule } from './admin/admin.module';
// import { PrismaService } from './prisma.service';

// import { ConfigModule } from '@nestjs/config';
// //import { OrderModule } from './order/order.model';
// import { PaymentModule } from './payment/payment.model';
// import { YooKassaService } from './payment/yookassa.service';
// import { DawnloadModule } from './dawnlad/dawnload.model';
// import { AuthModule } from './auth/auth.module';
// import { AppService } from './app.service';
// import { AppController } from './app.controller';
// import { AuthService } from './auth/auth.service';

// @Module({
//   imports: [
//     AdminModule, 
//     //OrderModule, 
//     PaymentModule, 
//     ConfigModule.forRoot({isGlobal: true}), 
//     DawnloadModule, 

//   ],
//   controllers: [AppController],
//   providers: [AppService],
//   exports: [AuthService]
// })
// export class AppModule {}


import { Module } from '@nestjs/common';
import { AdminModule } from './modules/admin/admin.module';
import { PrismaService } from './shared/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './modules/payment/payment.model';
import { YooKassaService } from './shared/yookassa/yookassa.service';
import { DownloadModule } from './modules/dawnlad/dawnload.model';
import { AuthModule } from './modules/auth/auth.module';
import { AppService } from './app.service';
import { AppController } from './app.controller'; 
import { OrderModule } from './modules/order/order.model';
import { EmailService } from './shared/email/email.service';
import { PackModule } from './modules/pack/pack.module';
@Module({
  imports: [
    AdminModule, 
    AuthModule,
    OrderModule, 
    PaymentModule, 
    ConfigModule.forRoot({ isGlobal: true }), 
    DownloadModule, 
    PackModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService, 
    YooKassaService, 
    EmailService
  ],
})
export class AppModule {}