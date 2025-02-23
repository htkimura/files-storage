import { ApiProperty } from '@nestjs/swagger';

export class File {
  @ApiProperty()
  id: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  documentId: string;

  @ApiProperty()
  createdAt: Date;
}
