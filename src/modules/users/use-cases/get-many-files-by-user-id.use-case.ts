import { FileRepository } from '@modules/files/file.repository';
import { StorageService } from '@modules/storage';
import { Injectable, NotFoundException } from '@nestjs/common';

import { UserRepository } from '../user.repository';

export interface GetUserFilesArgs {
  userId: string;
}

@Injectable()
export class GetManyFilesByUserIdUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fileRepository: FileRepository,
    private readonly storageService: StorageService,
  ) {}

  async execute({ userId }: GetUserFilesArgs): Promise<string[]> {
    const foundUser = await this.userRepository.getById(userId);

    if (!foundUser) throw new NotFoundException('User not found');

    const files = await this.fileRepository.getManyByUserId(userId);

    return this.storageService.generateManyPresignedUrls(
      files.map((file) => file.path),
    );
  }
}
