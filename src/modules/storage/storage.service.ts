import { FileService } from '@modules/files';
import { Injectable } from '@nestjs/common';

import { R2Service } from './r2.service';
import {
  GetBulkFilesByIdsArgs,
  GetBulkFilesByIdsUseCase,
  GetFileByIdArgs,
  GetFileByIdUseCase,
} from './use-cases';

@Injectable()
export class StorageService extends R2Service {
  constructor(
    fileService: FileService,
    private readonly getFileByIdUseCase: GetFileByIdUseCase,
    private readonly getBulkFilesByIdsUseCase: GetBulkFilesByIdsUseCase,
  ) {
    super(fileService);
  }

  async getFileById({ fileId, userId }: GetFileByIdArgs) {
    return this.getFileByIdUseCase.execute({ fileId, userId });
  }

  async getBulkFilesByIds({ ids, userId }: GetBulkFilesByIdsArgs) {
    return this.getBulkFilesByIdsUseCase.execute({ ids, userId });
  }
}
