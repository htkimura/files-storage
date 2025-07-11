import { ApiProperty } from '@nestjs/swagger';

import { File } from '../file.model';

export class GetUserFilesOutput {
  @ApiProperty({ type: [File] })
  data: File[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  size: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  hasMore: boolean;
}
