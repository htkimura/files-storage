import { Entity } from '@common/classes';
import { Document } from '@modules/documents';
import { User } from '@modules/users';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Folder extends Entity {
  @ApiProperty()
  title: string;

  @ApiProperty()
  userId: string;

  @ApiPropertyOptional({ type: User })
  user?: User;

  @ApiPropertyOptional({ type: [Document] })
  documents?: Document[];
}
