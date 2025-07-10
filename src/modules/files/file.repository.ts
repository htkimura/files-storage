import { PrismaService } from '@modules/prisma';
import { Injectable } from '@nestjs/common';

import { File } from './file.model';

@Injectable()
export class FileRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getManyByUserId(userId: string): Promise<File[]> {
    return this.prismaService.file.findMany({
      where: {
        userId,
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

  create(data: Omit<File, 'id' | 'createdAt' | 'updatedAt'>): Promise<File> {
    const now = new Date();

    return this.prismaService.file.create({
      data: {
        ...data,
        createdAt: now,
        updatedAt: now,
      },
    });
  }
}
