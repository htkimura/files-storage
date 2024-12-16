import { AuthMiddleware } from '@common/middlewares';
import { FileModule } from '@modules/files';
import { GlobalModule } from '@modules/global';
import { PrismaModule } from '@modules/prisma';
import { UserModule } from '@modules/users';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { StorageModule } from './modules/storage';

@Module({
  imports: [StorageModule, PrismaModule, GlobalModule, UserModule, FileModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
