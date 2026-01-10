import { Injectable, NotFoundException } from '@nestjs/common';

import { FolderRepository } from '../folder.repository';

export interface DeleteFolderArgs {
  userId: string;
  folderId: string;
}

@Injectable()
export class DeleteFolderUseCase {
  constructor(private readonly folderRepository: FolderRepository) {}

  async execute({ userId, folderId }: DeleteFolderArgs): Promise<boolean> {
    const folder = await this.folderRepository.getById(folderId);

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    if (folder.userId !== userId) {
      throw new NotFoundException('Folder not found');
    }

    await this.folderRepository.deleteById(folderId);

    return true;
  }
}
