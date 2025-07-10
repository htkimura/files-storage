import { config } from 'dotenv';

console.log('==> CONFIG');
config();

export const {
  PORT = 3000,
  NODE_ENV = 'dev',
  SECRET = '***',
  R2_ACCOUNT_ID = '***',
  R2_ACCESS_KEY_ID = '***',
  R2_SECRET_ACCESS_KEY = '***',
  R2_BUCKET_NAME = '***',
  AUTH_JWT_SECRET = '***',
  AUTH_JWT_REFRESH_SECRET = '***',
  AUTH_HEADER = 'authorization',
  AUTH_EXPIRES_IN = '14d',
} = process.env;

console.log('[PORT, NODE]', PORT, NODE_ENV);
