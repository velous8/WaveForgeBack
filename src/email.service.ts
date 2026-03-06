import { Injectable } from "@nestjs/common";
import nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    async emailSender(email: string, subject: string, text: string) {
        const transporter = nodemailer.createTransport({
                    host: process.env.MAIL_HOST,
                    port: process.env.MAIL_PORT,
                    secure: true, 
                    auth: {
                        user: process.env.MAIL_USER,     
                        pass: process.env.MAIL_PASSWORD,
                    },
                })
        await transporter.sendMail({
                from: process.env.MAIL_USER,
                to: email,
                subject: subject,
                text: text
            })
    }
}