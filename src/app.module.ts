import { Module } from '@nestjs/common';

import { StorageModule } from './modules/storage';

@Module({
  imports: [StorageModule],
})
export class AppModule {}
