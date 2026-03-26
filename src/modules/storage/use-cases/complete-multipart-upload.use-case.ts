import { BullMQJob, BullMQQueue } from '@common/enums';
import { FileService } from '@modules/files';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';

import { R2Service } from '../r2.service';

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
    @InjectQueue(BullMQQueue.THUMBNAIL_QUEUE)
    private readonly thumbnailQueue: Queue,
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

    const normalizedParts = parts.map((p) => ({
      PartNumber: p.partNumber,
      ETag: normalizePartEtag(p.etag),
    }));

    await this.r2Service.finalizeMultipartObject(
      file.path,
      uploadId,
      normalizedParts,
    );

    await this.fileService.update(fileId, { multipartUploadId: null });

    await this.thumbnailQueue.add(BullMQJob.IMAGE_THUMBNAIL_JOB, {
      fileId,
      userId,
    });

    return true;
  }
}
