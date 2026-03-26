import { FileService } from '@modules/files';
import { UserService } from '@modules/users/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';

import { InitMultipartUploadOutput } from '../models';
import { R2Service } from '../r2.service';

export interface InitMultipartUploadArgs {
  userId: string;
  fileInput: { name: string; type: string; size: number };
}

@Injectable()
export class InitMultipartUploadUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly r2Service: R2Service,
  ) {}

  async execute({
    userId,
    fileInput,
  }: InitMultipartUploadArgs): Promise<InitMultipartUploadOutput> {
    const foundUser = await this.userService.getUserById({ userId });

    if (!foundUser) throw new NotFoundException('User not found');

    const { id, key, uploadId } = await this.r2Service.createMultipartUpload(
      userId,
      fileInput,
    );

    const file = await this.fileService.create({
      ...fileInput,
      userId,
      path: key,
      id,
      multipartUploadId: uploadId,
    });

    return { file };
  }
}
