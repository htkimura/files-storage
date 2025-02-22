import { FileModule } from '@modules/files';
import { Module } from '@nestjs/common';

import { R2Service } from './r2.service';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';

@Module({
  imports: [FileModule],
  controllers: [StorageController],
  exports: [StorageService],
  providers: [StorageService, R2Service],
})
export class StorageModule {}
