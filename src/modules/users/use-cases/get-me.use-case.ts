import { Injectable, NotFoundException } from '@nestjs/common';

import { EnrichedUser, enrichUser } from '../user.model';
import { UserRepository } from '../user.repository';

export interface GetMeArgs {
  userId: string;
}

@Injectable()
export class GetMeUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId }: GetMeArgs): Promise<EnrichedUser> {
    const foundUser = await this.userRepository.getById(userId);

    if (!foundUser) throw new NotFoundException('User not found');

    return enrichUser(foundUser);
  }
}
