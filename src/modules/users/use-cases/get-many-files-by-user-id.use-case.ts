import { File } from '@modules/files';
import { FileRepository } from '@modules/files/file.repository';
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
  ) {}

  async execute({ userId }: GetUserFilesArgs): Promise<File[]> {
    const foundUser = await this.userRepository.getById(userId);

    if (!foundUser) throw new NotFoundException('User not found');

    return this.fileRepository.getManyByUserId(userId);
  }
}
