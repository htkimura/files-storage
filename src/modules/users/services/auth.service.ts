import { AUTH_EXPIRES_IN, AUTH_JWT_REFRESH_SECRET } from '@common/config';
import { JUser, TokenStatus } from '@common/types';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';

import { User, UserLogin } from '../user.model';

export interface GetUserFromTokenResponse {
  user: JUser | null;
  tokenStatus: TokenStatus;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateUserTokens(user: User): { token: string; refreshToken: string } {
    const token = this.jwtService.sign(
      {
        _id: user._id,
        email: user.email,
      },
      { subject: user._id },
    );

    const refreshToken = this.jwtService.sign(
      {
        _id: user._id,
        email: user.email,
      },
      {
        subject: user._id,
        expiresIn: AUTH_EXPIRES_IN,
        secret: AUTH_JWT_REFRESH_SECRET,
      },
    );
    return { token, refreshToken };
  }

  getUserLoginPayload(user: User): UserLogin {
    const { token, refreshToken } = this.generateUserTokens(user);

    return { token, user, refreshToken };
  }

  verifyRefreshToken(token: string): GetUserFromTokenResponse {
    try {
      const user = this.jwtService.verify(token, {
        secret: AUTH_JWT_REFRESH_SECRET,
      });
      return { user, tokenStatus: 'valid' };
    } catch (error) {
      let tokenStatus: TokenStatus = 'invalid';
      if (error instanceof TokenExpiredError) {
        tokenStatus = 'expired';
      }
      return { user: null, tokenStatus };
    }
  }

  verifyToken(token: string | null): GetUserFromTokenResponse {
    if (!token) {
      return { user: null, tokenStatus: 'missing' };
    }

    try {
      const user = this.jwtService.verify(token);
      return { user, tokenStatus: 'valid' };
    } catch (error) {
      let tokenStatus: TokenStatus = 'invalid';
      if (error instanceof TokenExpiredError) {
        tokenStatus = 'expired';
      }
      return { user: null, tokenStatus };
    }
  }

  getUserConnection(authHeader: string | string[] | undefined): string | null {
    try {
      if (!authHeader) return null;
      const token = this.getBearerToken(authHeader);
      return token ?? null;
    } catch {
      return null;
    }
  }

  getBearerToken(authHeader: string | string[]): string | undefined {
    return authHeader.toString().split('Bearer ')[1];
  }

  getTokenFromHeader(
    authHeader: string | string[] | undefined,
  ): GetUserFromTokenResponse {
    const token = this.getUserConnection(authHeader);
    return this.verifyToken(token);
  }
}
