import { Injectable } from '@nestjs/common';

import { FileRepository } from './file.repository';
import { UploadFileArgs, UploadFileUseCase } from './use-cases';

@Injectable()
export class FileService {
  constructor(
    private readonly uploadUseCase: UploadFileUseCase,
    private readonly fileRepository: FileRepository,
  ) {}

  getManyByUserId(userId: string) {
    return this.fileRepository.getManyByUserId(userId);
  }

  getManyLatestByDocumentIds(documentIds: string[]) {
    return this.fileRepository.getManyLatestByDocumentIds(documentIds);
  }

  async upload(args: UploadFileArgs) {
    return this.uploadUseCase.execute(args);
  }
}
