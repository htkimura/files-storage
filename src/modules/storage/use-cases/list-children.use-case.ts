import { FileService } from '@modules/files';
import { FolderService } from '@modules/folders/folder.service';
import { UserService } from '@modules/users/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';

import { ListChildrenDto } from '../dto';
import { ListChildrenOutput } from '../models';

export interface ListChildrenArgs extends ListChildrenDto {
  userId: string;
}

@Injectable()
export class ListChildrenUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly folderService: FolderService,
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
      this.folderService.getUserFolders({ userId, parentFolderId }),
      this.fileService.getManyByUserId({
        userId,
        skip: (page - 1) * size,
        take: size,
        filters: { folderId: parentFolderId },
      }),
      this.fileService.getCountByUserId(userId, parentFolderId),
    ]);

    return {
      page,
      size,
      total: totalFiles + folders.length,
      hasMore: totalFiles > page * size,
      data: { folders, files },
    };
  }
}
