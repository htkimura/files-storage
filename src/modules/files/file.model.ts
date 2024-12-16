import { ApiProperty } from '@nestjs/swagger';

export class File {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  userId: string;
}
