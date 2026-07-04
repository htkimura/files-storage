import { FileService } from '@modules/files';
import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from '../user.model';
import { UserRepository } from '../user.repository';

export interface RecalculateStorageConsumedArgs {
  userId: string;
}

@Injectable()
export class RecalculateStorageConsumedUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fileService: FileService,
  ) {}

  async execute({ userId }: RecalculateStorageConsumedArgs): Promise<User> {
    const foundUser = await this.userRepository.getById(userId);

    if (!foundUser) throw new NotFoundException('User not found');

    const totalBytes =
      await this.fileService.sumCompletedStorageByUserId(userId);

    return this.userRepository.setStorageConsumedCount(userId, totalBytes);
  }
}
