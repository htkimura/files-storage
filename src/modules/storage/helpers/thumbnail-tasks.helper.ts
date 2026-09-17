export function shouldEnqueueThumbnailViaCloudTasks(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  const mode = env.THUMBNAIL_TASKS_MODE ?? 'inline';
  const projectId = env.GCP_PROJECT_ID ?? '';
  const handlerUrl = env.CLOUD_TASKS_HANDLER_URL ?? '';

  if (mode === 'inline') {
    return false;
  }

  if (mode === 'cloud-tasks') {
    return Boolean(projectId && handlerUrl);
  }

  return Boolean(projectId && handlerUrl);
}

export function isCloudTasksModeMisconfigured(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  const mode = env.THUMBNAIL_TASKS_MODE ?? 'inline';

  if (mode !== 'cloud-tasks') {
    return false;
  }

  return !shouldEnqueueThumbnailViaCloudTasks(env);
}

export function thumbnailTaskQueuePath(
  projectId: string,
  location: string,
  queue: string,
): string {
  return `projects/${projectId}/locations/${location}/queues/${queue}`;
}
