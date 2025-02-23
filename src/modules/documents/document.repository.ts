import { BaseRepositoryPrisma } from '@common/classes';
import { Injectable } from '@nestjs/common';

import { Document } from './document.model';

export interface GetDocumentByUnique {
  userId: string;
  title: string;
}

export interface CreateDocumentInput
  extends Omit<Document, 'createdAt' | 'id' | 'updatedAt'> {
  createdAt?: Date;
}

export type UpdateDocumentInput = Partial<CreateDocumentInput>;

@Injectable()
export class DocumentRepository extends BaseRepositoryPrisma(
  Document,
  'document',
) {
  async getById(id: string): Promise<Document> {
    const data = await this.prismaService.document.findUnique({
      where: {
        id,
      },
    });
    return this.format(data);
  }
  async getByUnique(where: GetDocumentByUnique): Promise<Document> {
    const data = await this.prismaService.document.findFirst({
      where,
    });
    return this.format(data);
  }

  async getManyByUserId(userId: string): Promise<Document[]> {
    const data = await this.prismaService.document.findMany({
      where: {
        userId,
      },
    });
    return this.formatMany(data);
  }

  async create(data: CreateDocumentInput): Promise<Document> {
    const document = await this.prismaService.document.create({
      data,
    });

    return this.format(document);
  }

  async updateById(id: string, data: UpdateDocumentInput): Promise<Document> {
    const document = await this.prismaService.document.update({
      where: {
        id,
      },
      data,
    });

    return this.format(document);
  }
}
