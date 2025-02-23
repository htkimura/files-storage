import { Entity } from '@common/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Document extends Entity {
  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  latestVersionId: string;

  @ApiProperty()
  userId: string;

  @ApiPropertyOptional()
  folderId?: string;
}
