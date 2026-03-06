import { Body, Controller, Post } from "@nestjs/common";
import { BuyPackDto } from "./dto/buy-pack.dto";
import { AppService } from "./app.service";
import { RelinkDto } from "./dto/relink.dto";

@Controller()
export class AppController{
    constructor(private readonly appService: AppService) {}
    
    @Post('buy')
    buyPack(@Body() dto: BuyPackDto) {
        return this.appService.buyPack(dto)
    }


    @Post('relink')
    relink(@Body() dto: RelinkDto) {
        return this.appService.relink(dto)
    }
}