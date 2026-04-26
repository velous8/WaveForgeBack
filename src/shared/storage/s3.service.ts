import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";

@Injectable()
export class S3Service {
    private client = new S3Client({
        region: "ru-central1",
        endpoint: "https://storage.yandexcloud.net",
        credentials: {
            accessKeyId: process.env.YANDEX_STORAGE_ACCESS_KEY!,
            secretAccessKey: process.env.YANDEX_STORAGE_SECRET_KEY!,
        },
    })

    async createPresignedUrl(objectKey: string, expiresInSec = 300) {
        const command = new GetObjectCommand({
            Bucket: "sample-packs-prod",
            Key: "pack1.zip",
            ResponseContentDisposition: "attachment"
        })
    
        return getSignedUrl(this.client, command, {expiresIn: 300})
    }
}