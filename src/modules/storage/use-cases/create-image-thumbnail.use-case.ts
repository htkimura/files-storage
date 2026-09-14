import { buffer } from 'node:stream/consumers';

import { File, FileService } from '@modules/files';
import { UserService } from '@modules/users/user.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import {
  createWebpThumbnailBuffer,
  thumbnailPathFromOriginal,
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

    const thumbnailResult = await createWebpThumbnailBuffer(
      originalBuffer,
      contentType,
      file.path,
    );

    if (thumbnailResult.kind === 'skipped') {
      this.logger.warn(
        `Thumbnail skipped for file ${fileId}: ${thumbnailResult.reason}`,
      );

      return file;
    }

    const thumbnailPath = thumbnailPathFromOriginal(file.path);

    if (!thumbnailPath) {
      this.logger.warn(
        `Thumbnail skipped for file ${fileId}: path has no extension`,
      );
      return file;
    }

    await this.r2Service.putObject(
      thumbnailPath,
      thumbnailResult.buffer,
      'image/webp',
    );

    return this.fileService.update(fileId, { thumbnailPath });
  }
}
