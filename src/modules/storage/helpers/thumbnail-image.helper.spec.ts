import {
  createWebpThumbnailBuffer,
  isThumbnailCandidate,
  thumbnailPathFromOriginal,
} from './thumbnail-image.helper';

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

describe('isThumbnailCandidate', () => {
  it('should accept listed image mime types', () => {
    expect(
      isThumbnailCandidate({
        type: 'image/jpeg',
        path: 'uploads/u/2024/1/originals/id-photo.jpg',
      }),
    ).toBe(true);
  });

  it('should accept HEIC by mime or extension', () => {
    expect(
      isThumbnailCandidate({
        type: 'image/heic',
        path: 'uploads/u/2024/1/originals/id-photo',
      }),
    ).toBe(true);

    expect(
      isThumbnailCandidate({
        type: 'application/octet-stream',
        path: 'uploads/u/2024/1/originals/id-photo.heif',
      }),
    ).toBe(true);
  });

  it('should reject non-image files', () => {
    expect(
      isThumbnailCandidate({
        type: 'application/pdf',
        path: 'uploads/u/2024/1/originals/id-doc.pdf',
      }),
    ).toBe(false);
  });
});

describe('thumbnailPathFromOriginal', () => {
  it('should rewrite originals to thumbnails and the extension to webp', () => {
    expect(
      thumbnailPathFromOriginal('uploads/u/2024/1/originals/abc-photo.jpg'),
    ).toBe('uploads/u/2024/1/thumbnails/abc-photo.webp');
  });

  it('should return null when the path has no extension', () => {
    expect(thumbnailPathFromOriginal('uploads/u/originals/noext')).toBe(null);
  });
});

describe('createWebpThumbnailBuffer', () => {
  it('should create a webp buffer from a png original', async () => {
    const result = await createWebpThumbnailBuffer(
      PNG_1X1,
      'image/png',
      'uploads/u/2024/1/originals/dot.png',
    );

    expect(result.kind).toBe('created');

    if (result.kind !== 'created') {
      return;
    }

    expect(result.buffer.subarray(0, 4).toString()).toBe('RIFF');
    expect(result.buffer.includes(Buffer.from('WEBP'))).toBe(true);
  });
});
