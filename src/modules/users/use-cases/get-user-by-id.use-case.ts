import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from '../user.model';
import { UserRepository } from '../user.repository';

export interface GetUserByIdArgs {
  userId: string;
}

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId }: GetUserByIdArgs): Promise<User> {
    const foundUser = await this.userRepository.getById(userId);

    if (!foundUser) throw new NotFoundException('User not found');

    return foundUser;
  }
}
