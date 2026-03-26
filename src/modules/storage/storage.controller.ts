import { AuthUser } from '@common/decorators';
import { BullMQJob, BullMQQueue } from '@common/enums';
import { AuthGuard } from '@common/guards';
import { JUser } from '@common/types';
import { File, FileWithPresignedUrl } from '@modules/files';
import { DeleteBulkFilesOutput, UploadFileOutput } from '@modules/files/models';
import { InjectQueue } from '@nestjs/bullmq';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Queue } from 'bullmq';

import {
  CompleteMultipartUploadDto,
  InitMultipartUploadDto,
  ListChildrenDto,
  MoveFileToFolderDto,
} from './dto';
import {
  InitMultipartUploadOutput,
  ListChildrenOutput,
  MultipartPartUrlOutput,
} from './models';
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

  @Post('uploads/multipart/init')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'initMultipartUpload',
    summary: 'Start a multipart upload (R2 / S3)',
    description:
      'Creates the file record and an R2 multipart upload. Upload each part via presigned part URLs, then call complete.',
  })
  @ApiResponse({
    status: 201,
    type: InitMultipartUploadOutput,
  })
  initMultipartUpload(
    @Body() body: InitMultipartUploadDto,
    @AuthUser() user: JUser,
  ) {
    return this.storageService.initMultipartUpload({
      userId: user._id,
      fileInput: {
        name: body.fileName,
        type: body.fileType,
        size: body.fileSize,
      },
    });
  }

  @Get('uploads/multipart/part-url')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'getMultipartPartUrl',
    summary: 'Presigned URL for a single multipart part',
  })
  @ApiResponse({
    status: 200,
    type: MultipartPartUrlOutput,
  })
  getMultipartPartUrl(
    @Query('fileId') fileId: string,
    @Query('partNumber', ParseIntPipe) partNumber: number,
    @AuthUser() user: JUser,
  ) {
    return this.storageService.getMultipartPartUrl({
      userId: user._id,
      fileId,
      partNumber,
    });
  }

  @Post('uploads/multipart/complete')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'completeMultipartUpload',
    summary: 'Finish multipart upload',
    description:
      'Completes the multipart upload on R2, clears in-progress state, and enqueues thumbnail generation when applicable.',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  completeMultipartUpload(
    @Body() body: CompleteMultipartUploadDto,
    @AuthUser() user: JUser,
  ) {
    return this.storageService.completeMultipartUpload({
      userId: user._id,
      fileId: body.fileId,
      parts: body.parts.map((p) => ({
        partNumber: p.partNumber,
        etag: p.etag,
      })),
    });
  }

  @Delete('uploads/multipart/abort')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'abortMultipartUpload',
    summary: 'Abort multipart upload',
    description:
      'Aborts the R2 multipart upload and deletes the pending file record.',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  abortMultipartUpload(
    @Query('fileId') fileId: string,
    @AuthUser() user: JUser,
  ) {
    return this.storageService.abortMultipartUpload({
      userId: user._id,
      fileId,
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

  @Get('children')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'listChildren',
    summary: 'Get content of a folder (also works for root folder)',
    description:
      'Returns content of a folder. If no folder is provided, list content of root folder',
  })
  @ApiResponse({
    status: 200,
    type: ListChildrenOutput,
  })
  listChildren(@AuthUser() user: JUser, @Query() input: ListChildrenDto) {
    return this.storageService.listChildren({
      userId: user._id,
      ...input,
    });
  }

  @Put('files/:id/folder')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'moveFileToFolder',
    summary: 'Move file to folder',
    description:
      'Moves a file to a folder or removes it from its folder. Set folderId to null to remove from folder.',
  })
  @ApiResponse({
    status: 200,
    type: File,
  })
  moveFileToFolder(
    @Param('id') id: string,
    @Body() input: MoveFileToFolderDto,
    @AuthUser() user: JUser,
  ) {
    return this.storageService.moveFileToFolder({
      fileId: id,
      userId: user._id,
      folderId: input.folderId ?? null,
    });
  }
}
