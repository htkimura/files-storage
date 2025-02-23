import { Injectable } from '@nestjs/common';

import {
  CreateDocumentInput,
  DocumentRepository,
  GetDocumentByUnique,
  UpdateDocumentInput,
} from './document.repository';
import { GetManyFilesByUserIdUseCase, GetUserFilesArgs } from './use-cases';
import { DocumentWithLatestFile } from './use-cases';

@Injectable()
export class DocumentService {
  constructor(
    private readonly getManyFilesByUserIdUseCase: GetManyFilesByUserIdUseCase,
    private readonly documentRepository: DocumentRepository,
  ) {}

  async getById(id: string) {
    return this.documentRepository.getById(id);
  }

  async getByUnique(where: GetDocumentByUnique) {
    return this.documentRepository.getByUnique(where);
  }

  async getUserDocuments(
    args: GetUserFilesArgs,
  ): Promise<DocumentWithLatestFile[]> {
    return this.getManyFilesByUserIdUseCase.execute(args);
  }

  async create(data: CreateDocumentInput) {
    return this.documentRepository.create(data);
  }

  async updateById(id: string, data: UpdateDocumentInput) {
    return this.documentRepository.updateById(id, data);
  }
}
