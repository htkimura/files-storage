import { buffer } from 'node:stream/consumers';

import { File, FileService } from '@modules/files';
import { UserService } from '@modules/users/user.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import {
  bufferToWebpThumbnail,
  errMessage,
  heicBufferToJpeg,
  isHeifDecodeUnsupported,
  isLikelyHeic,
} from '../helpers';
import { R2Service } from '../r2.service';

export interface CreateImageThumbnailArgs {
  userId: string;
  fileId: string;
}

@Injectable()
export class CreateImageThumbnailUseCase {
  private readonly logger = new Logger(CreateImageThumbnailUseCase.name);

  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly r2Service: R2Service,
  ) {}

  async execute({ userId, fileId }: CreateImageThumbnailArgs): Promise<File> {
    const foundUser = await this.userService.getUserById({ userId });

    if (!foundUser) throw new NotFoundException('User not found');

    const file = await this.fileService.getById(fileId);

    if (!file) throw new NotFoundException('File not found');

    if (file.userId !== userId) throw new NotFoundException('File not found');

    const original = await this.r2Service.getObject(file.path);

    const originalBuffer = await buffer(original.Body as any);

    const contentType = original.ContentType ?? undefined;

    const heicLikely = isLikelyHeic(contentType, file.path, originalBuffer);
    let thumbnail: Buffer;

    try {
      if (heicLikely) {
        const jpegBuffer = await heicBufferToJpeg(originalBuffer);
        thumbnail = await bufferToWebpThumbnail(jpegBuffer);
      } else {
        thumbnail = await bufferToWebpThumbnail(originalBuffer);
      }
    } catch (err) {
      if (heicLikely) {
        this.logger.warn(
          `Thumbnail skipped for file ${fileId} (HEIC pipeline): ${errMessage(err)}`,
        );
        return file;
      }
      if (isHeifDecodeUnsupported(err)) {
        try {
          const jpegBuffer = await heicBufferToJpeg(originalBuffer);
          thumbnail = await bufferToWebpThumbnail(jpegBuffer);
        } catch (err2) {
          this.logger.warn(
            `Thumbnail skipped for file ${fileId}: ${errMessage(err2)}`,
          );
          return file;
        }
      } else {
        throw err;
      }
    }

    const nameSegments = file.path.split('/').pop()?.split('.') ?? [];
    if (nameSegments.length < 2) {
      this.logger.warn(
        `Thumbnail skipped for file ${fileId}: path has no extension`,
      );
      return file;
    }
    const stemParts = nameSegments.slice(0, -1);
    const newFileName = [...stemParts, 'webp'].join('.');

    const thumbnailPathSplit = file.path
      .replace('originals', 'thumbnails')
      .split('/');
    thumbnailPathSplit.pop();
    const thumbnailPath = [...thumbnailPathSplit, newFileName].join('/');

    await this.r2Service.putObject(thumbnailPath, thumbnail, 'image/webp');

    return this.fileService.update(fileId, { thumbnailPath });
  }
}
