import { FileModule } from '@modules/files';
import { FolderModule } from '@modules/folders';
import { UserModule } from '@modules/users';
import { forwardRef, Module } from '@nestjs/common';

import { ThumbnailJobHandler } from './job-handlers';
import { R2Service } from './r2.service';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import {
  AbortMultipartUploadUseCase,
  CompleteMultipartUploadUseCase,
  CreateImageThumbnailUseCase,
  DeleteBulkFilesByIdsUseCase,
  DeleteFileByIdUseCase,
  GetBulkFilesByIdsUseCase,
  GetFileByIdUseCase,
  GetMultipartPartUrlUseCase,
  GetPresignedUploadUrlUseCase,
  InitMultipartUploadUseCase,
  ListChildrenUseCase,
  MoveFileToFolderUseCase,
} from './use-cases';

const useCases = [
  AbortMultipartUploadUseCase,
  CompleteMultipartUploadUseCase,
  CreateImageThumbnailUseCase,
  DeleteBulkFilesByIdsUseCase,
  DeleteFileByIdUseCase,
  GetBulkFilesByIdsUseCase,
  GetFileByIdUseCase,
  GetMultipartPartUrlUseCase,
  GetPresignedUploadUrlUseCase,
  InitMultipartUploadUseCase,
  ListChildrenUseCase,
  MoveFileToFolderUseCase,
];

@Module({
  imports: [FileModule, forwardRef(() => UserModule), FolderModule],
  controllers: [StorageController],
  exports: [StorageService, R2Service],
  providers: [StorageService, R2Service, ThumbnailJobHandler, ...useCases],
})
export class StorageModule {}
