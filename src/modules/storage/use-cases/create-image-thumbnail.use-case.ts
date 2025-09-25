import { buffer } from 'node:stream/consumers';

import { File, FileService } from '@modules/files';
import { UserService } from '@modules/users/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as sharp from 'sharp';

import { R2Service } from '../r2.service';

export interface CreateImageThumbnailArgs {
  userId: string;
  fileId: string;
}

@Injectable()
export class CreateImageThumbnailUseCase {
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

    const thumbnail = await sharp(originalBuffer)
      .resize(300)
      .webp({ quality: 60 })
      .toBuffer();

    const fileNameSplit = file.path.split('/').pop()?.split('.');
    fileNameSplit.pop();
    const newFileName = [...fileNameSplit, 'webp'].join('.');

    const thumbnailPathSplit = file.path
      .replace('originals', 'thumbnails')
      .split('/');
    thumbnailPathSplit.pop();
    const thumbnailPath = [...thumbnailPathSplit, newFileName].join('/');

    await this.r2Service.putObject(thumbnailPath, thumbnail, 'image/webp');

    return this.fileService.update(fileId, { thumbnailPath });
  }
}
