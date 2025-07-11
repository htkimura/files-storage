import { PrismaService } from '@modules/prisma';
import { Injectable } from '@nestjs/common';

import { File } from './file.model';

interface CreateFileInput extends Omit<File, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

@Injectable()
export class FileRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getManyByUserId(userId: string, skip: number, take: number): Promise<File[]> {
    return this.prismaService.file.findMany({
      where: {
        userId,
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
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
