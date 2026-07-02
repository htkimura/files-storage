import { ALL_IMAGE_MIME_TYPES } from '@common/constants';
import { FileFilterType } from '@common/enums';
import { Obj } from '@common/types';
import { FileRepository } from '@modules/files/file.repository';
import { GetUserFilesOutput } from '@modules/files/models';
import { FolderService } from '@modules/folders/folder.service';
import { R2Service } from '@modules/storage/r2.service';
import { Injectable, NotFoundException } from '@nestjs/common';

import { MyFilesDto } from '../dto';
import { UserRepository } from '../user.repository';

export interface GetUserFilesArgs extends MyFilesDto {
  userId: string;
}

@Injectable()
export class GetManyFilesByUserIdUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fileRepository: FileRepository,
    private readonly folderService: FolderService,
    private readonly r2Service: R2Service,
  ) {}

  async execute({
    userId,
    page,
    size,
    filterType,
    folderId,
  }: GetUserFilesArgs): Promise<GetUserFilesOutput> {
    const foundUser = await this.userRepository.getById(userId);

    if (!foundUser) throw new NotFoundException('User not found');

    if (folderId) {
      const folder = await this.folderService.getById(folderId);

      if (folder?.userId !== userId) {
        throw new NotFoundException('Folder not found');
      }
    }

    const filters = this.getFilters({ filterType, folderId });

    const [files, total] = await Promise.all([
      this.fileRepository.getManyByUserId({
        userId,
        skip: (page - 1) * size,
        take: size,
        filters,
      }),
      this.fileRepository.getCountByUserId(userId, undefined, filters),
    ]);

    const filesWithThumbnails = files.filter((file) => file.thumbnailPath);

    if (filesWithThumbnails.length === 0) {
      return {
        page,
        size,
        total,
        hasMore: total > page * size,
        data: files,
      };
    }

    const presignedThumbnailUrls =
      await this.r2Service.generateManyPresignedUrls(
        filesWithThumbnails.map((file) => file.thumbnailPath!),
      );

    const thumbnailUrlMap = new Map(
      filesWithThumbnails.map((file, index) => [
        file.id,
        presignedThumbnailUrls[index],
      ]),
    );

    return {
      page,
      size,
      total,
      hasMore: total > page * size,
      data: files.map((file) => ({
        ...file,
        presignedThumbnailUrl: thumbnailUrlMap.get(file.id),
      })),
    };
  }

  private getFilters({
    filterType,
    folderId,
  }: Pick<GetUserFilesArgs, 'filterType' | 'folderId'>) {
    const baseFilter: Obj = {};

    if (folderId !== undefined) {
      baseFilter.folderId = folderId === null ? { isSet: false } : folderId;
    }

    if (filterType) {
      if (filterType.includes(FileFilterType.IMAGE))
        baseFilter.type = {
          in: ALL_IMAGE_MIME_TYPES,
        };
    }

    return baseFilter;
  }
}
