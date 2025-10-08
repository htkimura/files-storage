import { ApiProperty } from '@nestjs/swagger';

import { FileWithPresignedThumbnailUrl } from '../file.model';

export class GetUserFilesOutput {
  @ApiProperty({ type: [FileWithPresignedThumbnailUrl] })
  data: FileWithPresignedThumbnailUrl[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  size: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  hasMore: boolean;
}
