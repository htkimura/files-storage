import { CloudTasksGuard } from '@common/guards';
import { FileModule } from '@modules/files';
import { FolderModule } from '@modules/folders';
import { UserModule } from '@modules/users';
import { forwardRef, Module } from '@nestjs/common';

import { InternalThumbnailController } from './internal-thumbnail.controller';
import { R2Service } from './r2.service';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import {
  AbortMultipartUploadUseCase,
  CompleteMultipartUploadUseCase,
  CreateImageThumbnailUseCase,
  EnqueueImageThumbnailUseCase,
  DeleteBulkFilesByIdsUseCase,
  DeleteFileByIdUseCase,
  GetBulkFilesByIdsUseCase,
  GetFileByIdUseCase,
  GetMultipartPartUrlUseCase,
  GetPresignedUploadUrlUseCase,
  InitMultipartUploadUseCase,
  ListChildrenUseCase,
  MoveFileToFolderUseCase,
  RenameFileUseCase,
} from './use-cases';

const useCases = [
  AbortMultipartUploadUseCase,
  CompleteMultipartUploadUseCase,
  CreateImageThumbnailUseCase,
  EnqueueImageThumbnailUseCase,
  DeleteBulkFilesByIdsUseCase,
  DeleteFileByIdUseCase,
  GetBulkFilesByIdsUseCase,
  GetFileByIdUseCase,
  GetMultipartPartUrlUseCase,
  GetPresignedUploadUrlUseCase,
  InitMultipartUploadUseCase,
  ListChildrenUseCase,
  MoveFileToFolderUseCase,
  RenameFileUseCase,
];

@Module({
  imports: [FileModule, forwardRef(() => UserModule), FolderModule],
  controllers: [StorageController, InternalThumbnailController],
  exports: [StorageService, R2Service],
  providers: [StorageService, R2Service, CloudTasksGuard, ...useCases],
})
export class StorageModule {}
