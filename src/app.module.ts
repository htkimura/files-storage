import { AuthMiddleware } from '@common/middlewares';
import { DocumentModule } from '@modules/documents';
import { FileModule } from '@modules/files';
import { FolderModule } from '@modules/folders';
import { GlobalModule } from '@modules/global';
import { PrismaModule } from '@modules/prisma';
import { UserModule } from '@modules/users';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { StorageModule } from './modules/storage';

@Module({
  imports: [
    StorageModule,
    PrismaModule,
    GlobalModule,
    UserModule,
    DocumentModule,
    FileModule,
    FolderModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
