import { AuthUser } from '@common/decorators';
import { AuthGuard } from '@common/guards';
import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { StorageService } from './storage.service';

@Controller()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('objects/:objectName')
  @UseGuards(AuthGuard)
  getObjectUrl(
    @AuthUser('_id') userId: string,
    @Param('objectName') objectName: string,
  ): Promise<string> {
    return this.storageService.generatePresignedUrl(`${userId}/${objectName}`);
  }

  @Post('objects')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadObject(
    @AuthUser('_id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return this.storageService.uploadObject(file, userId);
  }
}
