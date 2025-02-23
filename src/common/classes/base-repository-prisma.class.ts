// eslint-disable-next-line import/no-cycle
import { AllPrismaModels, PrismaTables } from '@common/types/utils.type';
import { PrismaService } from '@modules/prisma';
import { Inject, Injectable, mixin, Type } from '@nestjs/common';

import { BaseRepository } from './base-repository.class';

@Injectable()
export abstract class PrismaRepository<
  T,
  U extends PrismaTables,
> extends BaseRepository<T> {
  @Inject()
  prismaService: PrismaService;

  constructor(
    protected readonly Model: Type<T>,
    protected readonly table: U,
  ) {
    super();
  }

  async getById(id: string, options?: any): Promise<T | null> {
    // @ts-ignore
    const result = await this.prismaService[this.table].findFirst({
      where: {
        id,
        deletedAt: null,
      },
      ...options,
    });
    return this.format(result);
  }

  async getByIds(ids: string[], options?: any): Promise<T[]> {
    // @ts-ignore
    const result = await this.prismaService[this.table].findMany({
      where: {
        id: {
          in: ids,
        },
        deletedAt: null,
      },
      ...options,
    });
    return this.formatMany(result);
  }

  async existsIds(ids: string[]): Promise<boolean> {
    // @ts-ignore
    const count = await this.prismaService[this.table].count({
      where: { id: { in: ids }, deletedAt: null },
    });
    return count === ids.length;
  }

  async delete(ids: string[]): Promise<T> {
    // @ts-ignore
    const result = await this.prismaService[this.table].updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return this.format(result);
  }

  async deleteById(id: string): Promise<T> {
    // @ts-ignore
    const result = await this.prismaService[this.table].update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return this.format(result);
  }

  format<V extends AllPrismaModels[U] | null>(
    obj: Partial<V>,
  ): Partial<V> extends null ? null : T {
    if (!obj) {
      return null as Partial<V> extends null ? null : T;
    }

    return obj as Partial<V> extends null ? null : T;
  }

  formatMany<V extends AllPrismaModels[U]>(objArr: V[]): T[] {
    if (!objArr) {
      return [] as T[];
    }

    return objArr.map((obj) => this.format(obj)) as T[];
  }
}

export function BaseRepositoryPrisma<T, U extends PrismaTables>(
  modelClass: Type<T>,
  table: U,
): Type<PrismaRepository<T, U>> {
  @Injectable()
  class BaseRepositoryPrismaClass extends PrismaRepository<T, U> {
    constructor() {
      super(modelClass, table);
    }
  }

  return mixin(BaseRepositoryPrismaClass);
}
