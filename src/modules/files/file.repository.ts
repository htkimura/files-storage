import { BaseRepositoryPrisma } from '@common/classes';
import { Injectable } from '@nestjs/common';

import { File } from './file.model';

interface CreateFileInput extends Omit<File, 'id' | 'createdAt'> {
  createdAt?: Date;
}

@Injectable()
export class FileRepository extends BaseRepositoryPrisma(File, 'file') {
  async getManyByUserId(userId: string): Promise<File[]> {
    const data = await this.prismaService.file.findMany({
      where: {
        userId,
      },
    });
    return this.formatMany(data);
  }

  async getManyLatestByDocumentIds(documentIds: string[]): Promise<File[]> {
    const data = await this.prismaService.file.findMany({
      where: {
        documentId: {
          in: documentIds,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return this.formatMany(data);
  }

  async create(data: CreateFileInput): Promise<File> {
    const file = await this.prismaService.file.create({
      data,
    });
    return this.format(file);
  }
}
