import { FileService } from '@modules/files';
import { FolderService } from '@modules/folders/folder.service';
import { UserService } from '@modules/users/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';

import { ListChildrenDto } from '../dto';
import { ListChildrenOutput } from '../models';
import { R2Service } from '../r2.service';

export interface ListChildrenArgs extends ListChildrenDto {
  userId: string;
}

@Injectable()
export class ListChildrenUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly folderService: FolderService,
    private readonly r2Service: R2Service,
  ) {}

  async execute({
    parentFolderId = null,
    page,
    size,
    userId,
  }: ListChildrenArgs): Promise<ListChildrenOutput> {
    const foundUser = await this.userService.getUserById({ userId });

    if (!foundUser) throw new NotFoundException('User not found');

    if (parentFolderId) {
      const folder = await this.folderService.getById(parentFolderId);

      if (folder?.userId !== userId) {
        throw new NotFoundException('Folder not found');
      }
    }

    const [folders, files, totalFiles] = await Promise.all([
      this.folderService.getUserFolders({
        userId,
        parentFolderId,
      }),
      this.fileService.getManyByUserId({
        userId,
        skip: (page - 1) * size,
        take: size,
        filters: {
          folderId: parentFolderId ? parentFolderId : { isSet: false },
        },
      }),
      this.fileService.getCountByUserId(userId, parentFolderId),
    ]);

    const filesWithThumbnails = files.filter((file) => file.thumbnailPath);

    if (filesWithThumbnails.length === 0) {
      return {
        page,
        size,
        total: totalFiles + folders.length,
        hasMore: totalFiles > page * size,
        data: { folders, files },
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

    const filesWithPresignedThumbnails = files.map((file) => ({
      ...file,
      presignedThumbnailUrl: thumbnailUrlMap.get(file.id),
    }));

    return {
      page,
      size,
      total: totalFiles + folders.length,
      hasMore: totalFiles > page * size,
      data: { folders, files: filesWithPresignedThumbnails },
    };
  }
}
