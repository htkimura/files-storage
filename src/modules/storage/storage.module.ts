import { FileModule } from '@modules/files';
import { UserModule } from '@modules/users';
import { forwardRef, Module } from '@nestjs/common';

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
} from './use-cases';

const useCases = [
  CreateImageThumbnailUseCase,
  DeleteBulkFilesByIdsUseCase,
  DeleteFileByIdUseCase,
  GetBulkFilesByIdsUseCase,
  GetFileByIdUseCase,
  GetPresignedUploadUrlUseCase,
];

@Module({
  imports: [FileModule, forwardRef(() => UserModule)],
  controllers: [StorageController],
  exports: [StorageService],
  providers: [StorageService, R2Service, ...useCases],
})
export class StorageModule {}
