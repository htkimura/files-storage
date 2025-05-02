import { AuthUser } from '@common/decorators';
import { AuthGuard } from '@common/guards';
import { JUser } from '@common/types';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { StorageService } from './storage.service';

@Controller()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('uploads/presigned-url')
  @UseGuards(AuthGuard)
  getPresignedUrl(
    @Query('fileName') name: string,
    @Query('fileType') type: string,
    @Query('fileSize', { transform: (size) => Number(size) })
    size: number,
    @AuthUser() user: JUser,
  ) {
    return this.storageService.createPresignedUpload(user._id, {
      name,
      type,
      size,
    });
  }
}
