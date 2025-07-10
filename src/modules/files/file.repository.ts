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
    }) as Promise<File[]>;
  }

  getById(fileId: string): Promise<File> {
    return this.prismaService.file.findUnique({
      where: { id: fileId },
    }) as Promise<File>;
  }

  create(data: Omit<File, 'id' | 'createdAt' | 'updatedAt'>): Promise<File> {
    return this.prismaService.file.create({
      data,
    }) as Promise<File>;
  }
}
