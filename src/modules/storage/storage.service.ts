import { FileService } from '@modules/files';
import { Injectable } from '@nestjs/common';

import { R2Service } from './r2.service';
import {
  DeleteFileByIdArgs,
  DeleteFileByIdUseCase,
  GetBulkFilesByIdsArgs,
  GetBulkFilesByIdsUseCase,
  GetFileByIdArgs,
  GetFileByIdUseCase,
  GetPresignedUploadUrlArgs,
  GetPresignedUploadUrlUseCase,
} from './use-cases';

@Injectable()
export class StorageService extends R2Service {
  constructor(
    fileService: FileService,
    private readonly deleteFileByIdUseCase: DeleteFileByIdUseCase,
    private readonly getBulkFilesByIdsUseCase: GetBulkFilesByIdsUseCase,
    private readonly getFileByIdUseCase: GetFileByIdUseCase,
    private readonly getPresignedUploadUrlUseCase: GetPresignedUploadUrlUseCase,
  ) {
    super(fileService);
  }

  async deleteFileById(input: DeleteFileByIdArgs) {
    return this.deleteFileByIdUseCase.execute(input);
  }

  async getFileById(input: GetFileByIdArgs) {
    return this.getFileByIdUseCase.execute(input);
  }

  async getBulkFilesByIds(input: GetBulkFilesByIdsArgs) {
    return this.getBulkFilesByIdsUseCase.execute(input);
  }

  async getPresignedUploadUrl(input: GetPresignedUploadUrlArgs) {
    return this.getPresignedUploadUrlUseCase.execute(input);
  }
}
