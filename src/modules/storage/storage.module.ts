import { FileModule } from '@modules/files';
import { UserModule } from '@modules/users';
import { forwardRef, Module } from '@nestjs/common';

import { R2Service } from './r2.service';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import {
  DeleteFileByIdUseCase,
  GetBulkFilesByIdsUseCase,
  GetFileByIdUseCase,
} from './use-cases';

const useCases = [
  DeleteFileByIdUseCase,
  GetBulkFilesByIdsUseCase,
  GetFileByIdUseCase,
];

@Module({
  imports: [FileModule, forwardRef(() => UserModule)],
  controllers: [StorageController],
  exports: [StorageService],
  providers: [StorageService, R2Service, ...useCases],
})
export class StorageModule {}
