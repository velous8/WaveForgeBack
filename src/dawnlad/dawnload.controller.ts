import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
import { DownloadService } from "./dawnload.service";

@Controller('dawnload')
export class DownloadController {
    constructor(private readonly downloadService: DownloadService) {}

    @Get(":token")
     async getRedirectUrl(@Param('token') token: string, @Res() res: any) { ///////any???
       return res.redirect(await this.downloadService.getRedirectUrl(token))
    }


    @Post()
    createDownloadLink(@Body()  body: { orderIds: string[] }) { ///////для чего???
        return this.downloadService.createDownloadLink(body.orderIds)
    }

    
}