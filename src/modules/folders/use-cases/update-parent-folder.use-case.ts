import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Folder } from '../folder.model';
import { FolderRepository } from '../folder.repository';

export interface UpdateParentFolderArgs {
  userId: string;
  folderId: string;
  parentFolderId: string | null;
}

@Injectable()
export class UpdateParentFolderUseCase {
  constructor(private readonly folderRepository: FolderRepository) {}

  async execute({
    userId,
    folderId,
    parentFolderId,
  }: UpdateParentFolderArgs): Promise<Folder> {
    const folder = await this.folderRepository.getById(folderId);

    if (folder?.userId !== userId) {
      throw new NotFoundException('Folder not found');
    }

    if (parentFolderId === null) {
      return this.folderRepository.update(folderId, {
        parentFolderId,
      });
    }

    const parentFolder = await this.folderRepository.getById(parentFolderId);

    if (parentFolder?.userId !== userId) {
      throw new NotFoundException('Parent folder not found');
    }

    // Prevent circular reference: don't allow moving a folder into itself or its descendants
    if (parentFolder.id === folderId) {
      throw new BadRequestException('Cannot move folder into itself');
    }

    // Check if parentFolder is a descendant of folderId (would create circular reference)
    if (parentFolder.parentFolderId) {
      let currentParentId: string | undefined = parentFolder.parentFolderId;
      while (currentParentId) {
        if (currentParentId === folderId) {
          throw new BadRequestException(
            'Cannot move folder into its own descendant',
          );
        }
        const currentParent =
          await this.folderRepository.getById(currentParentId);
        if (!currentParent) break;
        currentParentId = currentParent.parentFolderId;
      }
    }

    return this.folderRepository.update(folderId, {
      parentFolderId,
    });
  }
}
