import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  _id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({
    description: 'Total bytes consumed by completed user files',
  })
  storageConsumedCount: number;
}

export class UserLogin {
  @ApiProperty()
  token: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  @Type(() => User)
  user: User;
}
