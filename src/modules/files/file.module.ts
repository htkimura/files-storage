import { DocumentModule } from '@modules/documents';
import { StorageModule } from '@modules/storage';
import { UserModule } from '@modules/users';
import { forwardRef, Module } from '@nestjs/common';

import { FileController } from './file.controller';
import { FileRepository } from './file.repository';
import { FileService } from './file.service';
import { UploadFileUseCase } from './use-cases';

const useCases = [UploadFileUseCase];

@Module({
  imports: [UserModule, StorageModule, forwardRef(() => DocumentModule)],
  controllers: [FileController],
  exports: [FileService],
  providers: [FileService, FileRepository, ...useCases],
})
export class FileModule {}
