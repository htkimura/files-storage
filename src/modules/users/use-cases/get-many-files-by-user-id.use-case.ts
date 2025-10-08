import { ALL_IMAGE_MIME_TYPES } from '@common/constants';
import { FileFilterType } from '@common/enums';
import { Obj } from '@common/types';
import { FileRepository } from '@modules/files/file.repository';
import { GetUserFilesOutput } from '@modules/files/models';
import { Injectable, NotFoundException } from '@nestjs/common';

import { FileFilters } from '../dto';
import { UserRepository } from '../user.repository';

export interface GetUserFilesArgs {
  userId: string;
  page: number;
  size: number;
  filters?: FileFilters;
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
    filters: inputFilters = {},
  }: GetUserFilesArgs): Promise<GetUserFilesOutput> {
    const foundUser = await this.userRepository.getById(userId);

    if (!foundUser) throw new NotFoundException('User not found');

    const filters = this.getFilters(inputFilters);

    const [files, total] = await Promise.all([
      this.fileRepository.getManyByUserId({
        userId,
        skip: (page - 1) * size,
        take: size,
        filters,
      }),
      this.fileRepository.getCountByUserId(userId),
    ]);

    return { page, size, total, hasMore: total > page * size, data: files };
  }

  private getFilters(filters: FileFilters) {
    const baseFilter: Obj = {};

    if (filters.type) {
      if (filters.type.includes(FileFilterType.IMAGE))
        baseFilter.type = {
          in: ALL_IMAGE_MIME_TYPES,
        };
    }

    return baseFilter;
  }
}
