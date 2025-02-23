import { ApiProperty } from '@nestjs/swagger';

export class Entity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
