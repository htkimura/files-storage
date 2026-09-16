import * as sharp from 'sharp';

import { ALL_IMAGE_MIME_TYPES } from '../../../common/constants';

import convert = require('heic-convert');

const HEIC_FTYP_MAJORS = new Set([
  'heic',
  'heix',
  'hevx',
  'hevc',
  'mif1',
  'msf1',
]);

function sniffHeicFtypMajor(buf: Buffer): boolean {
  if (buf.length < 12) {
    return false;
  }
  if (buf.toString('ascii', 4, 8) !== 'ftyp') {
    return false;
  }
  const major = buf.toString('ascii', 8, 12);
  if (major === 'avif' || major === 'avis') {
    return false;
  }
  return HEIC_FTYP_MAJORS.has(major);
}

export function isLikelyHeic(
  contentType: string | undefined,
  filePath: string,
  buf: Buffer,
): boolean {
  const ct = contentType?.toLowerCase() ?? '';
  if (ct.includes('heic') || ct.includes('heif')) {
    return true;
  }
  const ext = filePath.split('.').pop()?.toLowerCase();
  if (ext === 'heic' || ext === 'heif') {
    return true;
  }
  return sniffHeicFtypMajor(buf);
}

export function isHeifDecodeUnsupported(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes('heif:') ||
    /compression format has not been built in/i.test(msg)
  );
}

export function errMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export async function heicBufferToJpeg(buf: Buffer): Promise<Buffer> {
  const jpeg = await convert({
    buffer: buf,
    format: 'JPEG',
    quality: 0.92,
  });
  return Buffer.isBuffer(jpeg) ? jpeg : Buffer.from(jpeg);
}

export function bufferToWebpThumbnail(input: Buffer): Promise<Buffer> {
  return sharp(input).rotate().resize(300).webp({ quality: 60 }).toBuffer();
}

export function isThumbnailCandidate(file: {
  type: string;
  path: string;
}): boolean {
  const type = file.type.toLowerCase();

  if (ALL_IMAGE_MIME_TYPES.includes(type)) {
    return true;
  }

  if (type.includes('heic') || type.includes('heif')) {
    return true;
  }

  const ext = file.path.split('.').pop()?.toLowerCase();

  if (ext === 'heic' || ext === 'heif') {
    return true;
  }

  return false;
}

export function thumbnailPathFromOriginal(originalPath: string): string | null {
  const nameSegments = originalPath.split('/').pop()?.split('.') ?? [];

  if (nameSegments.length < 2) {
    return null;
  }

  const stemParts = nameSegments.slice(0, -1);
  const newFileName = [...stemParts, 'webp'].join('.');

  const thumbnailPathSplit = originalPath
    .replace('originals', 'thumbnails')
    .split('/');

  thumbnailPathSplit.pop();
  return [...thumbnailPathSplit, newFileName].join('/');
}

type WebpThumbnailResult =
  | { kind: 'created'; buffer: Buffer }
  | { kind: 'skipped'; reason: string };

export async function createWebpThumbnailBuffer(
  originalBuffer: Buffer,
  contentType: string | undefined,
  filePath: string,
): Promise<WebpThumbnailResult> {
  const heicLikely = isLikelyHeic(contentType, filePath, originalBuffer);

  try {
    if (heicLikely) {
      const jpegBuffer = await heicBufferToJpeg(originalBuffer);

      return {
        kind: 'created',
        buffer: await bufferToWebpThumbnail(jpegBuffer),
      };
    }

    return {
      kind: 'created',
      buffer: await bufferToWebpThumbnail(originalBuffer),
    };
  } catch (err) {
    if (heicLikely) {
      return {
        kind: 'skipped',
        reason: `HEIC pipeline: ${errMessage(err)}`,
      };
    }

    if (isHeifDecodeUnsupported(err)) {
      try {
        const jpegBuffer = await heicBufferToJpeg(originalBuffer);

        return {
          kind: 'created',
          buffer: await bufferToWebpThumbnail(jpegBuffer),
        };
      } catch (err2) {
        return {
          kind: 'skipped',
          reason: errMessage(err2),
        };
      }
    }

    throw err;
  }
}
