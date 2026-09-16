import { CloudTasksGuard } from '@common/guards';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiExcludeController, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ProcessThumbnailTaskDto } from './dto';
import { StorageService } from './storage.service';

@ApiExcludeController()
@Controller('internal/thumbnails')
export class InternalThumbnailController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @UseGuards(CloudTasksGuard)
  @ApiOperation({
    operationId: 'processThumbnailTask',
    summary: 'Cloud Tasks worker for image thumbnails',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async processThumbnailTask(@Body() body: ProcessThumbnailTaskDto) {
    await this.storageService.createImageThumbnail({
      userId: body.userId,
      fileId: body.fileId,
    });

    return true;
  }
}
