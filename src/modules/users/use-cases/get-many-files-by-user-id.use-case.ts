import { FileRepository } from '@modules/files/file.repository';
import { GetUserFilesOutput } from '@modules/files/models';
import { Injectable, NotFoundException } from '@nestjs/common';

import { UserRepository } from '../user.repository';

export interface GetUserFilesArgs {
  userId: string;
  page: number;
  size: number;
}

@Injectable()
export class GetManyFilesByUserIdUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fileRepository: FileRepository,
  ) {}

  async execute({
    userId,
    page,
    size,
  }: GetUserFilesArgs): Promise<GetUserFilesOutput> {
    const foundUser = await this.userRepository.getById(userId);

    if (!foundUser) throw new NotFoundException('User not found');

    const [files, total] = await Promise.all([
      this.fileRepository.getManyByUserId(userId, (page - 1) * size, size),
      this.fileRepository.getCountByUserId(userId),
    ]);

    return { page, size, total, hasMore: total > page * size, data: files };
  }
}
