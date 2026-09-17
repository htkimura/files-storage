import {
  CLOUD_TASKS_HANDLER_URL,
  CLOUD_TASKS_INVOKER_EMAIL,
} from '@common/config';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class CloudTasksGuard implements CanActivate {
  private readonly oauth = new OAuth2Client();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!CLOUD_TASKS_HANDLER_URL || !CLOUD_TASKS_INVOKER_EMAIL) {
      throw new UnauthorizedException('Cloud Tasks handler is not configured');
    }

    const request = context.switchToHttp().getRequest<{ headers: { authorization?: string } }>();
    const header = request.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Cloud Tasks OIDC token');
    }

    const token = header.slice('Bearer '.length);

    const ticket = await this.oauth.verifyIdToken({
      idToken: token,
      audience: CLOUD_TASKS_HANDLER_URL,
    });

    const payload = ticket.getPayload();

    if (!payload?.email || payload.email !== CLOUD_TASKS_INVOKER_EMAIL) {
      throw new UnauthorizedException('Invalid Cloud Tasks caller');
    }

    return true;
  }
}
