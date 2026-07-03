import { Injectable, NotFoundException } from '@nestjs/common';

import { ListMyFoldersDto } from '../dto';
import { Folder } from '../folder.model';
import { FolderRepository } from '../folder.repository';

export interface ListMyFoldersArgs extends ListMyFoldersDto {
  userId: string;
}

@Injectable()
export class ListMyFoldersUseCase {
  constructor(private readonly folderRepository: FolderRepository) {}

  async execute({
    userId,
    parentFolderId,
  }: ListMyFoldersArgs): Promise<Folder[]> {
    if (parentFolderId) {
      const folder = await this.folderRepository.getById(parentFolderId);

      if (folder?.userId !== userId) {
        throw new NotFoundException('Folder not found');
      }
    }

    return this.folderRepository.getManyByUserId({ userId, parentFolderId });
  }
}
