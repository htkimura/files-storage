import { FileModule } from '@modules/files';
import { StorageModule } from '@modules/storage';
import { UserModule } from '@modules/users';
import { forwardRef, Module } from '@nestjs/common';

import { DocumentController } from './document.controller';
import { DocumentRepository } from './document.repository';
import { DocumentService } from './document.service';
import { GetManyFilesByUserIdUseCase } from './use-cases';

const useCases = [GetManyFilesByUserIdUseCase];

@Module({
  imports: [UserModule, StorageModule, forwardRef(() => FileModule)],
  controllers: [DocumentController],
  exports: [DocumentService, DocumentRepository],
  providers: [DocumentService, DocumentRepository, ...useCases],
})
export class DocumentModule {}
