import { Entity } from '@common/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class User extends Entity {
  @ApiProperty()
  email: string;

  @ApiProperty()
  refreshToken: string;
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
