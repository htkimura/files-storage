import { Injectable } from '@nestjs/common';

import { Folder } from './folder.model';
import { FolderRepository } from './folder.repository';
import { CreateFolderInput } from './folder.repository';
import { GetUserManyFoldersUseCase } from './use-cases';

@Injectable()
export class FolderService {
  constructor(
    private readonly getUserManyFoldersUseCase: GetUserManyFoldersUseCase,
    private readonly folderRepository: FolderRepository,
  ) {}

  async getUserManyFolder(userId: string): Promise<Folder[]> {
    return this.getUserManyFoldersUseCase.execute(userId);
  }

  async create(data: CreateFolderInput): Promise<Folder> {
    return this.folderRepository.create(data);
  }
}
