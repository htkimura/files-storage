import { Request as ExpressRequest } from 'express';

export type TokenStatus = 'valid' | 'invalid' | 'expired' | 'missing';

export interface JUser {
  iss: string;
  email: string;
  id: string;
  /**
   * User Id
   */
  sub: string;
  iat: number;
  exp: number;
  // role: Role
}

export interface Request extends ExpressRequest {
  user?: JUser | null;
  api_key?: string | null;
  orgId?: string | null;
  tokenStatus: TokenStatus;
}
