import { AUTH_EXPIRES_IN, AUTH_JWT_SECRET } from '@common/config';
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

const exposedModules = [jwtModule];
const exposedProviders = [CryptService];

@Global()
@Module({
  imports: exposedModules,
  exports: [...exposedModules, ...exposedProviders],
  providers: exposedProviders,
})
export class GlobalModule {}
