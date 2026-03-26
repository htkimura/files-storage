import { FileService } from '@modules/files';
import { Injectable } from '@nestjs/common';

import { R2Service } from './r2.service';
import {
  AbortMultipartUploadArgs,
  AbortMultipartUploadUseCase,
  CompleteMultipartUploadArgs,
  CompleteMultipartUploadUseCase,
  CreateImageThumbnailArgs,
  CreateImageThumbnailUseCase,
  DeleteBulkFilesByIdsArgs,
  DeleteBulkFilesByIdsUseCase,
  DeleteFileByIdArgs,
  DeleteFileByIdUseCase,
  GetBulkFilesByIdsArgs,
  GetBulkFilesByIdsUseCase,
  GetFileByIdArgs,
  GetFileByIdUseCase,
  GetMultipartPartUrlArgs,
  GetMultipartPartUrlUseCase,
  GetPresignedUploadUrlArgs,
  GetPresignedUploadUrlUseCase,
  InitMultipartUploadArgs,
  InitMultipartUploadUseCase,
  ListChildrenArgs,
  ListChildrenUseCase,
  MoveFileToFolderArgs,
  MoveFileToFolderUseCase,
} from './use-cases';

@Injectable()
export class StorageService extends R2Service {
  constructor(
    fileService: FileService,
    private readonly deleteFileByIdUseCase: DeleteFileByIdUseCase,
    private readonly deleteBulkFilesByIdsUseCase: DeleteBulkFilesByIdsUseCase,
    private readonly getBulkFilesByIdsUseCase: GetBulkFilesByIdsUseCase,
    private readonly getFileByIdUseCase: GetFileByIdUseCase,
    private readonly getPresignedUploadUrlUseCase: GetPresignedUploadUrlUseCase,
    private readonly initMultipartUploadUseCase: InitMultipartUploadUseCase,
    private readonly getMultipartPartUrlUseCase: GetMultipartPartUrlUseCase,
    private readonly completeMultipartUploadUseCase: CompleteMultipartUploadUseCase,
    private readonly abortMultipartUploadUseCase: AbortMultipartUploadUseCase,
    private readonly createImageThumbnailUseCase: CreateImageThumbnailUseCase,
    private readonly listChildrenUseCase: ListChildrenUseCase,
    private readonly moveFileToFolderUseCase: MoveFileToFolderUseCase,
  ) {
    super(fileService);
  }

  async deleteFileById(input: DeleteFileByIdArgs) {
    return this.deleteFileByIdUseCase.execute(input);
  }

  async deleteBulkFilesByIds(input: DeleteBulkFilesByIdsArgs) {
    return this.deleteBulkFilesByIdsUseCase.execute(input);
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

  async initMultipartUpload(input: InitMultipartUploadArgs) {
    return this.initMultipartUploadUseCase.execute(input);
  }

  async getMultipartPartUrl(input: GetMultipartPartUrlArgs) {
    return this.getMultipartPartUrlUseCase.execute(input);
  }

  async completeMultipartUpload(input: CompleteMultipartUploadArgs) {
    return this.completeMultipartUploadUseCase.execute(input);
  }

  async abortMultipartUpload(input: AbortMultipartUploadArgs) {
    return this.abortMultipartUploadUseCase.execute(input);
  }

  async createImageThumbnail(input: CreateImageThumbnailArgs) {
    return this.createImageThumbnailUseCase.execute(input);
  }

  async listChildren(input: ListChildrenArgs) {
    return this.listChildrenUseCase.execute(input);
  }

  async moveFileToFolder(input: MoveFileToFolderArgs) {
    return this.moveFileToFolderUseCase.execute(input);
  }
}
