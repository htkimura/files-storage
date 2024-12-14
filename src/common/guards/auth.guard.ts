import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from '../types';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { tokenStatus, user } = context.switchToHttp().getRequest<Request>();

    if (tokenStatus === 'missing')
      throw new UnauthorizedException('Authentication token is missing');

    if (tokenStatus && tokenStatus !== 'valid') {
      throw new UnauthorizedException(`Authentication token is ${tokenStatus}`);
    }

    if (!user) throw new UnauthorizedException();

    return true;
  }
}
