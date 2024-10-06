import { Module } from '@nestjs/common';

import { R3Service } from './r3.service';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';

@Module({
  controllers: [StorageController],
  providers: [StorageService, R3Service],
})
export class StorageModule {}
