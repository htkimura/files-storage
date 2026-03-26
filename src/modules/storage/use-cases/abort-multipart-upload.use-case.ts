import { FileService } from '@modules/files';
import { Injectable, NotFoundException } from '@nestjs/common';

import { R2Service } from '../r2.service';

export interface AbortMultipartUploadArgs {
  userId: string;
  fileId: string;
}

@Injectable()
export class AbortMultipartUploadUseCase {
  constructor(
    private readonly fileService: FileService,
    private readonly r2Service: R2Service,
  ) {}

  async execute({
    userId,
    fileId,
  }: AbortMultipartUploadArgs): Promise<boolean> {
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

    try {
      await this.r2Service.cancelMultipartObject(file.path, uploadId);
    } catch {
      // Best-effort: object may already be gone or upload completed elsewhere
    }

    await this.fileService.deleteById(fileId);

    return true;
  }
}
