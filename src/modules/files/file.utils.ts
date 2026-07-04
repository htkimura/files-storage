/** Completed uploads count toward storage; in-progress multipart uploads do not. */
export function isStorageCountedFile(file: {
  multipartUploadId?: string | null;
}): boolean {
  return !file.multipartUploadId;
}
