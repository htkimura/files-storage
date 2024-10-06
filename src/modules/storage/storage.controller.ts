import { Controller, Get, Headers, Param } from '@nestjs/common';

import { StorageService } from './storage.service';

@Controller()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('/objects/:objectName')
  getObjectPublicUrl(
    @Headers('x-user-id') userId: string,
    @Param('objectName') objectName: string,
  ): string {
    return this.storageService.getObjectPublicUrl(userId, objectName);
  }
}
