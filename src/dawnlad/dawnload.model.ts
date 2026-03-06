import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';

import { DownloadService } from './dawnload.service';
import { S3Service } from './s3.service';
import { DownloadController } from './dawnload.controller';


@Module({
  controllers: [DownloadController],
  providers: [PrismaService, DownloadService, S3Service],
  exports: [DownloadService]
})
export class DownloadModule {}
