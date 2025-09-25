import { AuthUser } from '@common/decorators';
import { BullMQJob, BullMQQueue } from '@common/enums';
import { AuthGuard } from '@common/guards';
import { JUser } from '@common/types';
import { FileWithPresignedUrl } from '@modules/files';
import { DeleteBulkFilesOutput, UploadFileOutput } from '@modules/files/models';
import { InjectQueue } from '@nestjs/bullmq';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Queue } from 'bullmq';

import { StorageService } from './storage.service';

@Controller()
export class StorageController {
  constructor(
    private readonly storageService: StorageService,

    @InjectQueue(BullMQQueue.THUMBNAIL_QUEUE)
    private readonly thumbnailQueue: Queue,
  ) {}

  @Get('uploads/presigned-url')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'getPresignedUploadUrl',
    summary: 'Get presigned url to upload file',
    description: 'Returns presigned url to upload file',
  })
  @ApiResponse({
    status: 200,
    type: UploadFileOutput,
  })
  getPresignedUploadUrl(
    @Query('fileName') name: string,
    @Query('fileType') type: string,
    @Query('fileSize', { transform: (size) => Number(size) })
    size: number,
    @AuthUser() user: JUser,
  ) {
    return this.storageService.getPresignedUploadUrl({
      userId: user._id,
      fileInput: {
        name,
        type,
        size,
      },
    });
  }

  @Post('uploads/image-uploaded')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'imageUploaded',
    summary: 'Confirms the image upload',
    description:
      'Confirms the file upload, adding the file to the thumbnail queue',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async imageUploaded(
    @Body() { fileId }: { fileId: string },
    @AuthUser() user: JUser,
  ) {
    await this.thumbnailQueue.add(BullMQJob.IMAGE_THUMBNAIL_JOB, {
      fileId,
      userId: user._id,
    });

    return true;
  }

  @Get('files/bulk')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'getBulkFilesByIds',
    summary: 'Get the authenticated user files by ids with presigned urls',
    description:
      'Returns the authenticated user files by ids with presigned urls',
  })
  @ApiResponse({
    status: 200,
    type: [FileWithPresignedUrl],
  })
  getBulkFilesByIds(@Query('ids') ids: string[], @AuthUser() user: JUser) {
    return this.storageService.getBulkFilesByIds({ ids, userId: user._id });
  }

  @Get('files/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'getFileById',
    summary: 'Get file by id with presigned url',
    description: 'Returns file by id with presigned url',
  })
  @ApiResponse({
    status: 200,
    type: FileWithPresignedUrl,
  })
  getFileById(@Param('id') id: string, @AuthUser() user: JUser) {
    return this.storageService.getFileById({ fileId: id, userId: user._id });
  }

  @Delete('files/bulk')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'deleteBulkFilesByIds',
    summary: 'Delete files by ids',
    description: 'Delete files on database and storage service by ids',
  })
  @ApiResponse({
    status: 200,
    type: DeleteBulkFilesOutput,
  })
  deleteBulkFilesByIds(@Query('ids') ids: string[], @AuthUser() user: JUser) {
    return this.storageService.deleteBulkFilesByIds({ ids, userId: user._id });
  }

  @Delete('files/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'deleteFileById',
    summary: 'Delete file by id',
    description: 'Delete file on database and storage service by id',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  deleteFileById(@Param('id') id: string, @AuthUser() user: JUser) {
    return this.storageService.deleteFileById({ fileId: id, userId: user._id });
  }
}
