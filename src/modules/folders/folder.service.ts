import { PrismaService } from '@modules/prisma';
import { Injectable } from '@nestjs/common';

import { Folder } from './folder.model';
import { FolderRepository } from './folder.repository';
import {
  CreateFolderArgs,
  CreateFolderUseCase,
  DeleteFolderArgs,
  DeleteFolderUseCase,
  RenameFolderArgs,
  RenameFolderUseCase,
  UpdateParentFolderArgs,
  UpdateParentFolderUseCase,
} from './use-cases';

@Injectable()
export class FolderService extends FolderRepository {
  constructor(
    prismaService: PrismaService,
    private readonly createFolderUseCase: CreateFolderUseCase,
    private readonly renameFolderUseCase: RenameFolderUseCase,
    private readonly updateParentFolderUseCase: UpdateParentFolderUseCase,
    private readonly deleteFolderUseCase: DeleteFolderUseCase,
  ) {
    super(prismaService);
  }

  createFolder(args: CreateFolderArgs): Promise<Folder> {
    return this.createFolderUseCase.execute(args);
  }

  renameFolder(args: RenameFolderArgs): Promise<Folder> {
    return this.renameFolderUseCase.execute(args);
  }

  updateParentFolder(args: UpdateParentFolderArgs): Promise<Folder> {
    return this.updateParentFolderUseCase.execute(args);
  }

  deleteFolder(args: DeleteFolderArgs): Promise<boolean> {
    return this.deleteFolderUseCase.execute(args);
  }

  getUserFolders(args: {
    userId: string;
    parentFolderId?: string | null;
  }): Promise<Folder[]> {
    return this.getManyByUserId(args);
  }
}
