import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePackDto } from './dto/create-pack.dto';
import { UpdatePackDto } from './dto/update-pack.dto';


@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) {}

    async getPacks() {
            return this.prisma.packs.findMany()   
    }

    async createPack(dto: CreatePackDto) {
        return this.prisma.packs.create({
            data: {
                title: dto.title,
                price: dto.price,
                file_key: dto.file_key
            }
        })
    }

    async updatePack(id: string, dto: UpdatePackDto) {
            return this.prisma.packs.update({
                where: {id},
                data: {
                    title: dto.title,
                    description: dto.description,
                    price: dto.price,
                    file_key: dto.file_key,
                    is_active: dto.is_active
                }
            })  
    }

    async deletePack(id: string) {
            return this.prisma.packs.delete({
                where: {id}
            })
    }
}
