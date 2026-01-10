import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateFolderDto } from '../dto';
import { Folder } from '../folder.model';
import { FolderRepository } from '../folder.repository';

export interface CreateFolderArgs extends CreateFolderDto {
  userId: string;
}

@Injectable()
export class CreateFolderUseCase {
  constructor(private readonly folderRepository: FolderRepository) {}

  async execute({
    userId,
    name,
    parentFolderId,
  }: CreateFolderArgs): Promise<Folder> {
    if (parentFolderId) {
      const parentFolder = await this.folderRepository.getById(parentFolderId);

      if (!parentFolder) {
        throw new NotFoundException('Parent folder not found');
      }

      if (parentFolder.userId !== userId) {
        throw new NotFoundException('Parent folder not found');
      }
    }

    return this.folderRepository.create({
      name,
      userId,
      parentFolderId,
    });
  }
}
