import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  R2_ACCESS_KEY_ID,
  R2_ACCOUNT_ID,
  R2_BUCKET_NAME,
  R2_SECRET_ACCESS_KEY,
} from '@common/config';
import { FileService } from '@modules/files';
import { Injectable } from '@nestjs/common';
import { uuid } from 'uuidv4';
@Injectable()
export class R2Service {
  private s3Client: S3Client;

  constructor(private readonly fileService: FileService) {
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

  generateManyPresignedUrls(keys: string[]) {
    const promises = keys.map((key) => {
      const command = new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      });

      return getSignedUrl(this.s3Client as any, command, {
        expiresIn: 100,
      });
    });

    return Promise.all(promises);
  }

  async createPresignedUpload(
    userId: string,
    file: { name: string; type: string; size: number },
  ) {
    const now = new Date();
    const key = `uploads/${userId}/${now.getUTCFullYear()}/${now.getUTCMonth() + 1}/originals/${uuid()}-${file.name}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: file.type,
    });

    const presignedUploadUrl = await getSignedUrl(
      this.s3Client as any,
      command,
      {
        expiresIn: 60 * 5,
      },
    );

    const uploadedFile = await this.fileService.create({
      ...file,
      userId,
      path: key,
    });

    return { presignedUploadUrl, file: uploadedFile };
  }

  async generateReadPresignedUrl(filePath: string) {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: filePath,
    });

    return getSignedUrl(this.s3Client as any, command, {
      expiresIn: 60 * 5,
    });
  }
}
