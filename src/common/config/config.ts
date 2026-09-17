import { config } from 'dotenv';

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
  GCP_PROJECT_ID = '',
  GCP_LOCATION = 'southamerica-east1',
  CLOUD_TASKS_QUEUE = 'thumbnail-queue',
  CLOUD_TASKS_HANDLER_URL = '',
  CLOUD_TASKS_INVOKER_EMAIL = '',
  THUMBNAIL_TASKS_MODE = 'inline',
} = process.env;
