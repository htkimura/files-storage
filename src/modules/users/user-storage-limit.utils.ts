import { getPlanDetails } from './user-plan.utils';

export function formatStorageBytes(bytes: number): string {
  if (bytes >= 1024 ** 3) {
    return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  }

  if (bytes >= 1024 ** 2) {
    return `${Math.round(bytes / 1024 ** 2)} MB`;
  }

  return `${bytes} B`;
}

export function getStorageLimitBytes(tier: string): number {
  return getPlanDetails(tier).storageLimit;
}

export function getProjectedStorageUsage(
  storageConsumedCount: number,
  pendingMultipartBytes: number,
  additionalBytes: number,
): number {
  return storageConsumedCount + pendingMultipartBytes + additionalBytes;
}

export function buildStorageLimitExceededMessage(
  tier: string,
  storageConsumedCount: number,
  pendingMultipartBytes: number,
): string {
  const limit = getStorageLimitBytes(tier);
  const used = storageConsumedCount + pendingMultipartBytes;

  return `Storage limit exceeded. You are using ${formatStorageBytes(used)} of ${formatStorageBytes(limit)}.`;
}
