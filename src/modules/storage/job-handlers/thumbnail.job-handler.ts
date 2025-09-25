import { BullMQJob, BullMQQueue } from '@common/enums';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { StorageService } from '../storage.service';

export interface ImageThumbnailJobData {
  userId: string;
  fileId: string;
}

interface ImageThumbnailJobResult {
  fileId: string;
  thumbnailPath: string;
}

@Processor(BullMQQueue.THUMBNAIL_QUEUE)
export class ThumbnailJobHandler extends WorkerHost {
  constructor(private readonly storageService: StorageService) {
    super();
    Logger.log(
      `[BullMQ] ThumbnailJobHandler ${BullMQQueue.THUMBNAIL_QUEUE} started`,
    );
  }

  async process(job: Job<any, any, string>): Promise<ImageThumbnailJobResult> {
    switch (job.name) {
      case BullMQJob.IMAGE_THUMBNAIL_JOB:
        return await this.handleImageThumbnail(job.data);

      default:
        Logger.error(
          `[BullMQ] Unknown job name for ${BullMQQueue.THUMBNAIL_QUEUE}: ${job.name}`,
        );
        return {
          ...job.data,
          thumbnailPath: null,
        };
    }
  }

  async handleImageThumbnail(jobData: ImageThumbnailJobData) {
    Logger.log(
      `[BullMQ] Handling image thumbnail for file ${jobData.fileId}`,
      jobData,
    );

    const updatedFile = await this.storageService.createImageThumbnail(jobData);

    return {
      fileId: jobData.fileId,
      thumbnailPath: updatedFile.thumbnailPath,
    };
  }
}
