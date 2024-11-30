import { PrismaModule } from '@modules/prisma';
import { Module } from '@nestjs/common';

import { StorageModule } from './modules/storage';

@Module({
  imports: [StorageModule, PrismaModule],
})
export class AppModule {}
