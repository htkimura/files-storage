import { PaginationOutput } from '@common/models';
import { FileWithPresignedThumbnailUrl } from '@modules/files';
import { Folder } from '@modules/folders';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ListChildrenData {
  @ApiProperty({ type: [Folder] })
  @Type(() => Folder)
  folders: Folder[];

  @ApiProperty({ type: [FileWithPresignedThumbnailUrl] })
  @Type(() => FileWithPresignedThumbnailUrl)
  files: FileWithPresignedThumbnailUrl[];
}

export class ListChildrenOutput extends PaginationOutput {
  @ApiProperty({ type: ListChildrenData })
  @Type(() => ListChildrenData)
  data: ListChildrenData;
}
