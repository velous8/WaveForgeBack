import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
    region: "ru-central1",
    endpoint: "https://storage.yandexcloud.net",
    credentials: {
        accessKeyId: "YCAJEw01Ftn-1lpg1lo_qgCOf",
        secretAccessKey: "YCO0wibsTKFRkkB3g8C42pms7hPdvYctyE7_oHxH",
    },
})

async function test() {
    const command = new GetObjectCommand({
        Bucket: "sample-packs-prod",
        Key: "pack1.zip",
        ResponseContentDisposition: "attachment"
    })

    const url = await getSignedUrl(s3, command, {expiresIn: 300})

    console.log(url)
}

test().catch(console.error)