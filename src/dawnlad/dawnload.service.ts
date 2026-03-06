import { Injectable, NotFoundException } from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from './s3.service';


@Injectable()
export class DownloadService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly s3: S3Service
    ) {}


    //Создание токена и запись хеша в БД
    async createDownloadLink(orderIds: string[]) {
        if(!orderIds) return

        const expiresAt = new Date(Date.now() + 60*60*1000)

        const tokens = orderIds.map((orderId) => {
            const rawToken = randomUUID()
            const tokenHash = createHash('sha256').update(rawToken).digest('hex')
            return {
                rawToken,
                data:{
                    order_id: orderId,
                    token_hash: tokenHash,
                    expires_at: expiresAt
                }
            }
        })

        await this.prisma.$transaction(
            tokens.map((item) => 
                this.prisma.downloads.create({
                    data: item.data
                }))
        )

        return tokens.map((item) => {
            return process.env.DOWNLOAD_URL + item.rawToken
        })
    }

    //Вернуть ссылку на скачивание
    async getRedirectUrl(token: string) {
        const tokenHash = createHash('sha256').update(token).digest('hex')

        const dawnload = await this.prisma.downloads.findUnique({
            where: {token_hash: tokenHash},
            include: {orders: {include: {packs: {select: {file_key: true}}}}}
        })

        if(!dawnload) return

        if(dawnload.expires_at < new Date()) return 


        const storageKey = dawnload.orders.packs.file_key
        if(!storageKey) return 
        
        return this.prisma.$transaction(async (tx) => {
            dawnload.download_count += 1
            await tx.downloads.update({
                where: {id: dawnload.id},
                data: {download_count: dawnload.download_count}
            })

            return this.s3.createPresignedUrl(storageKey, 300)
        })
    }   
    
}