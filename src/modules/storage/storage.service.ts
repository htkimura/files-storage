import { FileService } from '@modules/files';
import { Injectable } from '@nestjs/common';

import { R2Service } from './r2.service';
import {
  DeleteFileByIdArgs,
  DeleteFileByIdUseCase,
  GetBulkFilesByIdsArgs,
  GetBulkFilesByIdsUseCase,
  GetFileByIdArgs,
  GetFileByIdUseCase,
} from './use-cases';

@Injectable()
export class StorageService extends R2Service {
  constructor(
    fileService: FileService,
    private readonly deleteFileByIdUseCase: DeleteFileByIdUseCase,
    private readonly getBulkFilesByIdsUseCase: GetBulkFilesByIdsUseCase,
    private readonly getFileByIdUseCase: GetFileByIdUseCase,
  ) {
    super(fileService);
  }

  async deleteFileById({ fileId, userId }: DeleteFileByIdArgs) {
    return this.deleteFileByIdUseCase.execute({ fileId, userId });
  }

  async getFileById({ fileId, userId }: GetFileByIdArgs) {
    return this.getFileByIdUseCase.execute({ fileId, userId });
  }

  async getBulkFilesByIds({ ids, userId }: GetBulkFilesByIdsArgs) {
    return this.getBulkFilesByIdsUseCase.execute({ ids, userId });
  }
}
