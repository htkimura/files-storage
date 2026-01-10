import { Entity } from '@common/models';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Folder extends Entity {
  @ApiProperty()
  name: string;

  @ApiProperty()
  userId: string;

  @ApiPropertyOptional()
  parentFolderId?: string;
}
