import { AuthMiddleware } from '@common/middlewares';
import { GlobalModule } from '@modules/global';
import { PrismaModule } from '@modules/prisma';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { StorageModule } from './modules/storage';

@Module({
  imports: [StorageModule, PrismaModule, GlobalModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
