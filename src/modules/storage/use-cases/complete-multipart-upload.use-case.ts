import { FileService } from '@modules/files';
import { UserService } from '@modules/users/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';

import { R2Service } from '../r2.service';
import { EnqueueImageThumbnailUseCase } from './enqueue-image-thumbnail.use-case';

export interface CompleteMultipartUploadArgs {
  userId: string;
  fileId: string;
  parts: { partNumber: number; etag: string }[];
}

function normalizePartEtag(etag: string): string {
  let t = etag.trim();

  if (t.startsWith('W/')) {
    t = t.slice(2).trim();
  }

  if (t.length >= 2 && t.startsWith('"') && t.endsWith('"')) {
    return t.slice(1, -1);
  }

  return t;
}

@Injectable()
export class CompleteMultipartUploadUseCase {
  constructor(
    private readonly fileService: FileService,
    private readonly r2Service: R2Service,
    private readonly userService: UserService,
    private readonly enqueueImageThumbnailUseCase: EnqueueImageThumbnailUseCase,
  ) {}

  async execute({
    userId,
    fileId,
    parts,
  }: CompleteMultipartUploadArgs): Promise<boolean> {
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

    await this.userService.assertStorageForUpload(userId, 0);

    const normalizedParts = parts.map((p) => ({
      PartNumber: p.partNumber,
      ETag: normalizePartEtag(p.etag),
    }));

    await this.r2Service.finalizeMultipartObject(
      file.path,
      uploadId,
      normalizedParts,
    );

    await this.fileService.update(fileId, {
      multipartUploadId: { unset: true },
    });

    await this.userService.adjustStorageConsumedCount(userId, file.size);

    await this.enqueueImageThumbnailUseCase.execute({
      fileId,
      userId,
    });

    return true;
  }
}
