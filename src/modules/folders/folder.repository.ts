import { PrismaService } from '@modules/prisma';
import { Injectable } from '@nestjs/common';

import { Folder } from './folder.model';

interface CreateFolderInput
  extends Omit<Folder, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

interface UpdateFolderInput
  extends Partial<
    Omit<Folder, 'id' | 'createdAt' | 'updatedAt' | 'parentFolderId'>
  > {
  parentFolderId?: string | null;
}

interface GetManyInput {
  userId: string;
  parentFolderId?: string;
}

@Injectable()
export class FolderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: CreateFolderInput): Promise<Folder> {
    const now = new Date();

    return this.prismaService.folder.create({
      data: {
        ...data,
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  getById(folderId: string): Promise<Folder> {
    return this.prismaService.folder.findUnique({
      where: { id: folderId },
    });
  }

  getManyByUserId({ userId, parentFolderId }: GetManyInput): Promise<Folder[]> {
    return this.prismaService.folder.findMany({
      where: { userId, parentFolderId },
    });
  }

  update(id: string, data: UpdateFolderInput): Promise<Folder> {
    const now = new Date();

    return this.prismaService.folder.update({
      data: {
        ...data,
        updatedAt: now,
      },
      where: { id },
    });
  }

  deleteById(folderId: string): Promise<Folder> {
    return this.prismaService.folder.delete({
      where: { id: folderId },
    });
  }
}
