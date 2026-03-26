import * as sharp from 'sharp';

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
  return sharp(input).resize(300).webp({ quality: 60 }).toBuffer();
}
