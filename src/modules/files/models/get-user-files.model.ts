import { PaginationOutput } from '@common/models';
import { ApiProperty } from '@nestjs/swagger';

import { FileWithPresignedThumbnailUrl } from '../file.model';

export class GetUserFilesOutput extends PaginationOutput {
  @ApiProperty({ type: [FileWithPresignedThumbnailUrl] })
  data: FileWithPresignedThumbnailUrl[];
}
