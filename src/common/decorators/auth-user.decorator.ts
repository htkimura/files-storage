import { JUser, Request } from '@common/types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator(
  (data: keyof JUser | undefined, context: ExecutionContext) => {
    const { user } = context.switchToHttp().getRequest<Request>();

    if (typeof data === 'string') return user[data];

    return user;
  },
);
