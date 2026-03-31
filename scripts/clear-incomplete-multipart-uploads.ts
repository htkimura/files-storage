/**
 * Aborts in-progress R2 multipart uploads and deletes matching File rows.
 * Targets documents where multipartUploadId is set (upload never completed).
 *
 * Usage (from repo root: files-storage/):
 *   npx ts-node --transpile-only -r dotenv/config scripts/clear-incomplete-multipart-uploads.ts
 *   npx ts-node --transpile-only -r dotenv/config scripts/clear-incomplete-multipart-uploads.ts --dry-run
 */

import { AbortMultipartUploadCommand, S3Client } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing required env: ${name}`);
  }
  return v;
}

function createR2Client(): S3Client {
  const accountId = requireEnv('R2_ACCOUNT_ID');
  return new S3Client({
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
      secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
    },
    region: 'auto',
  });
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const bucket = requireEnv('R2_BUCKET_NAME');
  const s3 = createR2Client();

  const pending = await prisma.file.findMany({
    where: {
      multipartUploadId: { not: null },
    },
  });

  const withUploadId = pending.filter(
    (f) => f.multipartUploadId && f.multipartUploadId.length > 0,
  );

  console.log(
    `Found ${withUploadId.length} file record(s) with incomplete multipart upload.`,
  );

  if (withUploadId.length === 0) {
    return;
  }

  for (const file of withUploadId) {
    const uploadId = file.multipartUploadId;
    const key = file.path;
    console.log(`\n${file.id}  ${file.name}`);
    console.log(`  path=${key}`);
    console.log(`  uploadId=${uploadId?.slice(0, 20)}…`);

    if (dryRun) {
      continue;
    }

    try {
      await s3.send(
        new AbortMultipartUploadCommand({
          Bucket: bucket,
          Key: key,
          UploadId: uploadId,
        }),
      );
      console.log('  R2: multipart aborted');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`  R2 abort (continuing): ${msg}`);
    }

    await prisma.file.delete({ where: { id: file.id } });
    console.log('  DB: row deleted');
  }

  if (dryRun) {
    console.log('\nDry run: no R2 or DB changes were made.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
