import { FileModule } from '@modules/files';
import { FolderModule } from '@modules/folders';
import { UserModule } from '@modules/users';
import { forwardRef, Module } from '@nestjs/common';

import { ThumbnailJobHandler } from './job-handlers';
import { R2Service } from './r2.service';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import {
  CreateImageThumbnailUseCase,
  DeleteBulkFilesByIdsUseCase,
  DeleteFileByIdUseCase,
  GetBulkFilesByIdsUseCase,
  GetFileByIdUseCase,
  GetPresignedUploadUrlUseCase,
  ListChildrenUseCase,
} from './use-cases';

const useCases = [
  CreateImageThumbnailUseCase,
  DeleteBulkFilesByIdsUseCase,
  DeleteFileByIdUseCase,
  GetBulkFilesByIdsUseCase,
  GetFileByIdUseCase,
  GetPresignedUploadUrlUseCase,
  ListChildrenUseCase,
];

@Module({
  imports: [FileModule, forwardRef(() => UserModule), FolderModule],
  controllers: [StorageController],
  exports: [StorageService, R2Service],
  providers: [StorageService, R2Service, ThumbnailJobHandler, ...useCases],
})
export class StorageModule {}
