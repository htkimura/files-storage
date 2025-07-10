import { Entity } from '@common/models';
import { ApiProperty } from '@nestjs/swagger';

export class File extends Entity {
  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  path: string;

  @ApiProperty()
  userId: string;
}

export class FileWithPresignedUrl extends File {
  @ApiProperty()
  presignedUrl: string;
}
