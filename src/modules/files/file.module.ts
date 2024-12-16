import { Module } from '@nestjs/common';

import { FileRepository } from './file.repository';
import { FileService } from './file.service';

@Module({
  exports: [FileService, FileRepository],
  providers: [FileService, FileRepository],
})
export class FileModule {}
