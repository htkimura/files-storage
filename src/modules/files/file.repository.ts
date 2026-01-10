import { Obj } from '@common/types';
import { PrismaService } from '@modules/prisma';
import { Injectable } from '@nestjs/common';

import { File } from './file.model';

interface CreateFileInput
  extends Omit<File, 'id' | 'createdAt' | 'updatedAt' | 'thumbnailPath'> {
  id?: string;
}

interface UpdateFileInput
  extends Partial<Omit<File, 'id' | 'createdAt' | 'updatedAt'>> {}

interface GetManyByUserId {
  userId: string;
  skip: number;
  take: number;
  filters?: Obj;
}

@Injectable()
export class FileRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getManyByUserId({
    userId,
    skip,
    take,
    filters,
  }: GetManyByUserId): Promise<File[]> {
    return this.prismaService.file.findMany({
      where: {
        userId,
        ...filters,
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  getCountByUserId(userId: string, folderId?: string | null): Promise<number> {
    return this.prismaService.file.count({
      where: {
        userId,
        folderId,
      },
    });
  }

  getById(fileId: string): Promise<File> {
    return this.prismaService.file.findUnique({
      where: { id: fileId },
    });
  }

  getByIds(ids: string[]): Promise<File[]> {
    return this.prismaService.file.findMany({
      where: { id: { in: ids } },
    });
  }

  create(data: CreateFileInput): Promise<File> {
    const now = new Date();

    return this.prismaService.file.create({
      data: {
        ...data,
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  update(id: string, data: UpdateFileInput): Promise<File> {
    const now = new Date();

    return this.prismaService.file.update({
      data: {
        ...data,
        updatedAt: now,
      },
      where: { id },
    });
  }

  deleteById(fileId: string): Promise<File> {
    return this.prismaService.file.delete({
      where: { id: fileId },
    });
  }

  deleteBulkByPaths(paths: string[]) {
    return this.prismaService.file.deleteMany({
      where: { path: { in: paths } },
    });
  }
}
