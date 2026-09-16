import { FileSortField, SortDirection } from '@common/enums';
import { Obj } from '@common/types';
import { getFileOrderBy } from '@common/utils';
import { PrismaService } from '@modules/prisma';
import { Injectable } from '@nestjs/common';

import { File } from './file.model';

interface CreateFileInput
  extends Omit<File, 'id' | 'createdAt' | 'updatedAt' | 'thumbnailPath'> {
  id?: string;
}

interface UpdateFileInput
  extends Partial<
    Omit<File, 'id' | 'createdAt' | 'updatedAt' | 'multipartUploadId'>
  > {
  multipartUploadId?: string | { unset: true };
}

interface GetManyByUserId {
  userId: string;
  skip: number;
  take: number;
  filters?: Obj;
  sortBy?: FileSortField;
  sortOrder?: SortDirection;
}

@Injectable()
export class FileRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getManyByUserId({
    userId,
    skip,
    take,
    filters,
    sortBy,
    sortOrder,
  }: GetManyByUserId): Promise<File[]> {
    return this.prismaService.file.findMany({
      where: {
        userId,
        multipartUploadId: { isSet: false },
        ...filters,
      },
      skip,
      take,
      orderBy: getFileOrderBy(sortBy, sortOrder),
    });
  }

  getCountByUserId(
    userId: string,
    folderId?: string | null,
    additionalFilters?: Obj,
  ): Promise<number> {
    return this.prismaService.file.count({
      where: {
        userId,
        multipartUploadId: { isSet: false },
        ...(folderId !== undefined
          ? {
              folderId: folderId === null ? { isSet: false } : folderId,
            }
          : {}),
        ...additionalFilters,
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

  async sumCompletedStorageByUserId(userId: string): Promise<number> {
    const result = await this.prismaService.file.aggregate({
      where: {
        userId,
        multipartUploadId: { isSet: false },
      },
      _sum: { size: true },
    });

    return result._sum.size ?? 0;
  }

  async sumPendingMultipartStorageByUserId(userId: string): Promise<number> {
    const result = await this.prismaService.file.aggregate({
      where: {
        userId,
        multipartUploadId: { isSet: true },
      },
      _sum: { size: true },
    });

    return result._sum.size ?? 0;
  }
}
