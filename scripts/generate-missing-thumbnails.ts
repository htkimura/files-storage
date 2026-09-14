/**
 * Generates webp thumbnails for completed image files that have no thumbnailPath.
 * Scoped to one user by email.
 *
 * Usage (from repo root: files-storage/):
 *   npx ts-node --transpile-only -r dotenv/config scripts/generate-missing-thumbnails.ts --email user@example.com
 *   npx ts-node --transpile-only -r dotenv/config scripts/generate-missing-thumbnails.ts --email user@example.com --dry-run
 */

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';

import {
  createWebpThumbnailBuffer,
  isThumbnailCandidate,
  thumbnailPathFromOriginal,
} from '../src/modules/storage/helpers';

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
  const args = process.argv.slice(2).filter((arg) => arg !== '--dry-run');
  const emailFlagIndex = args.indexOf('--email');

  const email =
    emailFlagIndex >= 0
      ? args[emailFlagIndex + 1]
      : args.find((arg) => !arg.startsWith('--'));

  if (!email || !email.includes('@')) {
    throw new Error(
      'Usage: generate-missing-thumbnails.ts --email user@example.com [--dry-run]',
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error(`User not found: ${email}`);
  }

  const completedFiles = await prisma.file.findMany({
    where: {
      userId: user.id,
      multipartUploadId: { isSet: false },
    },
  });

  const candidates = completedFiles.filter(
    (file) => !file.thumbnailPath && isThumbnailCandidate(file),
  );

  console.log(
    `Found ${candidates.length} file(s) without thumbnail for ${email} (${completedFiles.length} completed).`,
  );

  if (candidates.length === 0) {
    return;
  }

  const bucket = requireEnv('R2_BUCKET_NAME');
  const s3 = createR2Client();

  const failed: { id: string; reason: string }[] = [];

  const summary = {
    generated: 0,
    skipped: 0,
    failed,
  };

  for (const file of candidates) {
    console.log(`\n${file.id}  ${file.name}`);
    console.log(`  type=${file.type}`);
    console.log(`  path=${file.path}`);

    if (dryRun) {
      summary.skipped += 1;
      continue;
    }

    try {
      const original = await s3.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: file.path,
        }),
      );

      if (!original.Body) {
        throw new Error('R2 object has no body');
      }

      const thumbnailResult = await createWebpThumbnailBuffer(
        Buffer.from(await original.Body.transformToByteArray()),
        original.ContentType,
        file.path,
      );

      if (thumbnailResult.kind === 'skipped') {
        console.log(`  skipped: ${thumbnailResult.reason}`);
        summary.skipped += 1;
        continue;
      }

      const thumbnailPath = thumbnailPathFromOriginal(file.path);

      if (!thumbnailPath) {
        console.log('  skipped: path has no extension');
        summary.skipped += 1;
        continue;
      }

      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: thumbnailPath,
          Body: thumbnailResult.buffer,
          ContentType: 'image/webp',
        }),
      );

      await prisma.file.update({
        where: { id: file.id },
        data: { thumbnailPath },
      });

      console.log(`  thumbnail=${thumbnailPath}`);
      summary.generated += 1;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`  failed: ${msg}`);
      summary.failed.push({ id: file.id, reason: msg });
    }
  }

  console.log('\nSummary');
  console.log(`  generated=${summary.generated}`);
  console.log(`  skipped=${summary.skipped}`);
  console.log(`  failed=${summary.failed.length}`);

  for (const failure of summary.failed) {
    console.log(`  ${failure.id}: ${failure.reason}`);
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
