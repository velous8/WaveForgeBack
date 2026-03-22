import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class PackService {
  constructor(private readonly prisma: PrismaService){}
  async getAllPack() {
    const packsWithPreviews = await this.prisma.packs.findMany({
      include: {
        pack_previews: {
          select: {
            id:true,
            title:true,
            bpm:true,
            key:true,
            style:true,
            file_key:true,
          }
        },
      }
    });

    const result = packsWithPreviews.map(pack => ({
      pack_id: pack.id,
      pack_title: pack.title,
      pack_img_url: pack.image_url,
      pack_price: pack.price,
      pack_currency: pack.currency,
      pack_create_at: pack.created_at,
      preview_list: pack.pack_previews,
      previews_count: pack.pack_previews.length
    }));

    return result
  }

  async getPack(pack_id: string) {
        const pack = await this.prisma.packs.findFirst({
          where:{id: pack_id},
      include: {
        pack_previews: {
          select: {
            id:true,
            title:true,
            bpm:true,
            key:true,
            style:true,
            file_key:true,
          }
        },
      }
    });

    if(!pack) {
      return null
    }

        const result ={
      pack_id: pack.id,
      pack_title: pack.title,
      pack_description: pack.description,
      pack_img_url: pack.image_url,
      pack_price: pack.price,
      pack_currency: pack.currency,
      pack_create_at: pack.created_at,
      preview_list: pack.pack_previews,
      previews_count: pack.pack_previews.length
    };

    return result

  }
}