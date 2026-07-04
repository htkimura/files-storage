import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import {
  DEFAULT_USER_TIER,
  getPlanDetails,
  USER_TIER,
} from './user-plan.utils';

export class PlanDetails {
  @ApiProperty({
    description: 'Maximum storage in bytes for the user plan',
    example: 5_000_000_000,
  })
  storageLimit: number;
}

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

export class EnrichedUser extends User {
  @ApiProperty({
    description: 'Plan limits derived from tier at request time',
    type: PlanDetails,
  })
  planDetails: PlanDetails;
}

export function enrichUser(user: User): EnrichedUser {
  const tier = user.tier ?? DEFAULT_USER_TIER;

  return {
    ...user,
    tier,
    planDetails: getPlanDetails(tier),
  };
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
