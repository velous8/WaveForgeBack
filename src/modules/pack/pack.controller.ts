import { Controller, Get, Param } from "@nestjs/common";
import { PackService } from "./pack.service";

@Controller('pack')
export class PackController {
    constructor(private readonly packService: PackService) {}

    @Get()
    getAllPack() {
        return this.packService.getAllPack()
    }

    @Get('/:pack_id')
    getPack(@Param('pack_id') pack_id: string) {
        return this.packService.getPack(pack_id)
    }
}
