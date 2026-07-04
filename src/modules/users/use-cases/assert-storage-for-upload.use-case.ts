import { FileService } from '@modules/files';
import {
  Injectable,
  NotFoundException,
  PayloadTooLargeException,
} from '@nestjs/common';

import { User } from '../user.model';
import { UserRepository } from '../user.repository';
import {
  buildStorageLimitExceededMessage,
  getProjectedStorageUsage,
  getStorageLimitBytes,
} from '../user-storage-limit.utils';

export interface AssertStorageForUploadArgs {
  userId: string;
  additionalBytes: number;
}

@Injectable()
export class AssertStorageForUploadUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fileService: FileService,
  ) {}

  async execute({
    userId,
    additionalBytes,
  }: AssertStorageForUploadArgs): Promise<User> {
    const user = await this.userRepository.getById(userId);

    if (!user) throw new NotFoundException('User not found');

    const pendingMultipartBytes =
      await this.fileService.sumPendingMultipartStorageByUserId(userId);

    const projected = getProjectedStorageUsage(
      user.storageConsumedCount,
      pendingMultipartBytes,
      additionalBytes,
    );

    if (projected > getStorageLimitBytes(user.tier)) {
      throw new PayloadTooLargeException(
        buildStorageLimitExceededMessage(
          user.tier,
          user.storageConsumedCount,
          pendingMultipartBytes,
        ),
      );
    }

    return user;
  }
}
