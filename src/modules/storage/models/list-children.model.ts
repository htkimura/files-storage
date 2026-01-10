import { PaginationOutput } from '@common/models';
import { File } from '@modules/files';
import { Folder } from '@modules/folders';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ListChildrenData {
  @ApiProperty({ type: [Folder] })
  @Type(() => Folder)
  folders: Folder[];

  @ApiProperty({ type: [File] })
  @Type(() => File)
  files: File[];
}

export class ListChildrenOutput extends PaginationOutput {
  @ApiProperty({ type: ListChildrenData })
  @Type(() => ListChildrenData)
  data: ListChildrenData;
}
