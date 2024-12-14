import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  R2_ACCESS_KEY_ID,
  R2_ACCOUNT_ID,
  R2_BUCKET_NAME,
  R2_SECRET_ACCESS_KEY,
} from '@common/config';
import { Injectable } from '@nestjs/common';

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

  async generatePresignedUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(this.s3Client as any, command, {
      expiresIn: 100,
    });

    return signedUrl;
  }
}
