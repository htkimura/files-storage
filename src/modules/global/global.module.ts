import { AUTH_EXPIRES_IN, AUTH_JWT_SECRET, REDIS_URL } from '@common/config';
import { BullMQQueue } from '@common/enums';
import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { CryptService } from './services';

export const jwtModule = JwtModule.register({
  secret: AUTH_JWT_SECRET,
  signOptions: {
    expiresIn: AUTH_EXPIRES_IN,
    noTimestamp: false,
  },
});

const exposedModules = [
  jwtModule,
  BullModule.forRoot({
    connection: {
      url: REDIS_URL,
    },
  }),
  ...Object.values(BullMQQueue).map((queue) =>
    BullModule.registerQueue({ name: queue }),
  ),
];
const exposedProviders = [CryptService];

@Global()
@Module({
  imports: exposedModules,
  exports: [...exposedModules, ...exposedProviders],
  providers: exposedProviders,
})
export class GlobalModule {}
