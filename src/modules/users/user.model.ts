import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { DEFAULT_USER_TIER, USER_TIER } from './user-plan.utils';

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

  @ApiProperty({
    description: 'Subscription tier stored on the user record',
    enum: Object.values(USER_TIER),
    default: DEFAULT_USER_TIER,
  })
  tier: string;
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
