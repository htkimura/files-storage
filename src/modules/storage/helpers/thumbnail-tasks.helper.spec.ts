import {
  isCloudTasksModeMisconfigured,
  shouldEnqueueThumbnailViaCloudTasks,
} from './thumbnail-tasks.helper';

describe('shouldEnqueueThumbnailViaCloudTasks', () => {
  it('should stay inline when mode is inline', () => {
    expect(
      shouldEnqueueThumbnailViaCloudTasks({
        THUMBNAIL_TASKS_MODE: 'inline',
        GCP_PROJECT_ID: 'p1',
        CLOUD_TASKS_HANDLER_URL: 'https://example.com/internal/thumbnails',
      }),
    ).toBe(false);
  });

  it('should enqueue when cloud-tasks mode is fully configured', () => {
    expect(
      shouldEnqueueThumbnailViaCloudTasks({
        THUMBNAIL_TASKS_MODE: 'cloud-tasks',
        GCP_PROJECT_ID: 'p1',
        CLOUD_TASKS_HANDLER_URL: 'https://example.com/internal/thumbnails',
      }),
    ).toBe(true);
  });

  it('should detect misconfigured cloud-tasks mode', () => {
    expect(
      isCloudTasksModeMisconfigured({
        THUMBNAIL_TASKS_MODE: 'cloud-tasks',
        GCP_PROJECT_ID: '',
        CLOUD_TASKS_HANDLER_URL: '',
      }),
    ).toBe(true);
  });
});
