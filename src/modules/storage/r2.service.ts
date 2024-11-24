import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
  R2_ACCESS_KEY_ID,
  R2_ACCOUNT_ID,
  R2_BUCKET_NAME,
  R2_SECRET_ACCESS_KEY,
  SECRET,
} from '@common/config';
import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';

@Injectable()
export class R2Service {
  private s3Client: S3Client;

  constructor() {
    const s3 = new S3Client({
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
      region: 'auto', // Cloudflare R2 doesn't use regions, but this is required by the SDK
    });

    this.s3Client = s3;
  }

  async getObjectPublicUrl(userId: string, objectName: string) {
    const hashedUserId = createHmac('sha256', SECRET)
      .update(userId)
      .digest('hex');

    const objectKey = `${hashedUserId}/${objectName}`;

    const params = {
      Bucket: R2_BUCKET_NAME,
      Key: objectKey,
    };

    try {
      await this.s3Client.send(new GetObjectCommand(params));

      return `https://pub-${R2_ACCOUNT_ID}.r2.dev/${objectKey}`;
    } catch (error) {
      return null;
    }
  }
}
