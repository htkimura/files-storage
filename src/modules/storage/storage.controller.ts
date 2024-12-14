import { AuthUser } from '@common/decorators';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { StorageService } from './storage.service';

@Controller()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('/objects/:objectName')
  @UseGuards()
  getObjectUrl(
    @AuthUser('_id') userId: string,
    @Param('objectName') objectName: string,
  ): Promise<string> {
    return this.storageService.generatePresignedUrl(`${userId}/${objectName}`);
  }
}
