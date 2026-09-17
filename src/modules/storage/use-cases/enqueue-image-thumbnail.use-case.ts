import { CloudTasksClient } from '@google-cloud/tasks';
import {
  CLOUD_TASKS_HANDLER_URL,
  CLOUD_TASKS_INVOKER_EMAIL,
  CLOUD_TASKS_QUEUE,
  GCP_LOCATION,
  GCP_PROJECT_ID,
} from '@common/config';
import { Injectable, Logger } from '@nestjs/common';

import {
  isCloudTasksModeMisconfigured,
  shouldEnqueueThumbnailViaCloudTasks,
} from '../helpers/thumbnail-tasks.helper';
import {
  CreateImageThumbnailArgs,
  CreateImageThumbnailUseCase,
} from './create-image-thumbnail.use-case';

@Injectable()
export class EnqueueImageThumbnailUseCase {
  private readonly logger = new Logger(EnqueueImageThumbnailUseCase.name);

  private readonly tasksClient = new CloudTasksClient();

  constructor(
    private readonly createImageThumbnailUseCase: CreateImageThumbnailUseCase,
  ) {}

  async execute(args: CreateImageThumbnailArgs): Promise<void> {
    if (shouldEnqueueThumbnailViaCloudTasks()) {
      await this.enqueueCloudTask(args);

      return;
    }

    if (isCloudTasksModeMisconfigured()) {
      throw new Error(
        'THUMBNAIL_TASKS_MODE=cloud-tasks but GCP_PROJECT_ID or CLOUD_TASKS_HANDLER_URL is missing',
      );
    }

    await this.createImageThumbnailUseCase.execute(args);
  }

  private async enqueueCloudTask({
    userId,
    fileId,
  }: CreateImageThumbnailArgs): Promise<void> {
    if (!CLOUD_TASKS_INVOKER_EMAIL) {
      throw new Error('CLOUD_TASKS_INVOKER_EMAIL is required for Cloud Tasks');
    }

    const parent = this.tasksClient.queuePath(
      GCP_PROJECT_ID,
      GCP_LOCATION,
      CLOUD_TASKS_QUEUE,
    );

    const body = Buffer.from(JSON.stringify({ userId, fileId })).toString(
      'base64',
    );

    await this.tasksClient.createTask({
      parent,
      task: {
        httpRequest: {
          httpMethod: 'POST',
          url: CLOUD_TASKS_HANDLER_URL,
          headers: {
            'Content-Type': 'application/json',
          },
          body,
          oidcToken: {
            serviceAccountEmail: CLOUD_TASKS_INVOKER_EMAIL,
            audience: CLOUD_TASKS_HANDLER_URL,
          },
        },
      },
    });

    this.logger.log(`Enqueued thumbnail task for file ${fileId}`);
  }
}
