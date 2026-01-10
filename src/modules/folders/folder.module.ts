import { Module } from '@nestjs/common';

import { FolderRepository } from './folder.repository';
import { FolderService } from './folder.service';

@Module({
  exports: [FolderService, FolderRepository],
  providers: [FolderService, FolderRepository],
})
export class FolderModule {}
