import { Injectable } from '@nestjs/common';

import { Folder } from '../folder.model';
import { FolderRepository } from '../folder.repository';
@Injectable()
export class GetUserManyFoldersUseCase {
  constructor(private readonly folderRepository: FolderRepository) {}

  async execute(userId: string): Promise<Folder[]> {
    return this.folderRepository.getManyByUserId(userId);
  }
}
