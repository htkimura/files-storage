import { UserModule } from '@modules/users';
import { Module } from '@nestjs/common';

import { FolderController } from './folder.controller';
import { FolderRepository } from './folder.repository';
import { FolderService } from './folder.service';
import { GetUserManyFoldersUseCase } from './use-cases';

const useCases = [GetUserManyFoldersUseCase];

@Module({
  imports: [UserModule],
  controllers: [FolderController],
  exports: [FolderService, FolderRepository],
  providers: [FolderService, FolderRepository, ...useCases],
})
export class FolderModule {}
