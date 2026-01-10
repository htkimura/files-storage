import { Module } from '@nestjs/common';

import { FolderController } from './folder.controller';
import { FolderRepository } from './folder.repository';
import { FolderService } from './folder.service';
import {
  CreateFolderUseCase,
  DeleteFolderUseCase,
  RenameFolderUseCase,
  UpdateParentFolderUseCase,
} from './use-cases';

const useCases = [
  CreateFolderUseCase,
  RenameFolderUseCase,
  UpdateParentFolderUseCase,
  DeleteFolderUseCase,
];

@Module({
  controllers: [FolderController],
  exports: [FolderService, FolderRepository],
  providers: [...useCases, FolderService, FolderRepository],
})
export class FolderModule {}
