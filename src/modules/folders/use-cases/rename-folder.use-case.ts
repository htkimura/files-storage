import { Injectable, NotFoundException } from '@nestjs/common';

import { Folder } from '../folder.model';
import { FolderRepository } from '../folder.repository';

export interface RenameFolderArgs {
  userId: string;
  folderId: string;
  name: string;
}

@Injectable()
export class RenameFolderUseCase {
  constructor(private readonly folderRepository: FolderRepository) {}

  async execute({ userId, folderId, name }: RenameFolderArgs): Promise<Folder> {
    const folder = await this.folderRepository.getById(folderId);

    if (folder?.userId !== userId) {
      throw new NotFoundException('Folder not found');
    }

    return this.folderRepository.update(folderId, { name });
  }
}
