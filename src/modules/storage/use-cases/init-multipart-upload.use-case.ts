import { FileService } from '@modules/files';
import { UserService } from '@modules/users/user.service';
import { Injectable } from '@nestjs/common';

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
    await this.userService.assertStorageForUpload(userId, fileInput.size);

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
