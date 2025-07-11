import { AuthUser } from '@common/decorators';
import { AuthGuard } from '@common/guards';
import { JUser } from '@common/types';
import { FileWithPresignedUrl } from '@modules/files';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { StorageService } from './storage.service';

@Controller()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('uploads/presigned-url')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'getPresignedUrl',
    summary: 'Get presigned url to upload file',
    description: 'Returns presigned url to upload file',
  })
  @ApiResponse({
    status: 200,
    type: String,
  })
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
}
