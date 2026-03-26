import { FileService } from '@modules/files';
import { Injectable, NotFoundException } from '@nestjs/common';

import { MultipartPartUrlOutput } from '../models';
import { R2Service } from '../r2.service';

export interface GetMultipartPartUrlArgs {
  userId: string;
  fileId: string;
  partNumber: number;
}

@Injectable()
export class GetMultipartPartUrlUseCase {
  constructor(
    private readonly fileService: FileService,
    private readonly r2Service: R2Service,
  ) {}

  async execute({
    userId,
    fileId,
    partNumber,
  }: GetMultipartPartUrlArgs): Promise<MultipartPartUrlOutput> {
    const file = await this.fileService.getById(fileId);

    if (!file || file.userId !== userId) {
      throw new NotFoundException('File not found');
    }

    const uploadId = (file as { multipartUploadId?: string | null })
      .multipartUploadId;

    if (!uploadId) {
      throw new NotFoundException(
        'No multipart upload in progress for this file',
      );
    }

    const presignedUrl = await this.r2Service.getPresignedUploadPartUrl(
      file.path,
      uploadId,
      partNumber,
    );

    return { presignedUrl };
  }
}
