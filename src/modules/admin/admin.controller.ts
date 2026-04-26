import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { CreatePackDto } from './dto/create-pack.dto';
import { UpdatePackDto } from './dto/update-pack.dto';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  getPacks() {
    return this.adminService.getPacks()
  }
  
  @Post()
  createPack(@Body() data: CreatePackDto) {
    return this.adminService.createPack(data)
  }

  @Put('/:id')
  updatePack(@Param('id') id: string, @Body() data: UpdatePackDto) {
    return this.adminService.updatePack(id, data)
  }

  @Delete('/:id')
  deletePack(@Param('id') id: string) {
    return this.adminService.deletePack(id)
  }
}
