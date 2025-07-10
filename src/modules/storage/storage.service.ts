import { FileService } from '@modules/files';
import { Injectable } from '@nestjs/common';

import { R2Service } from './r2.service';
import {
  GetFileByIdArgs,
  GetFileByIdUseCase,
} from './use-cases/get-file-by-id.use-case';

@Injectable()
export class StorageService extends R2Service {
  constructor(
    private readonly getFileByIdUseCase: GetFileByIdUseCase,
    fileService: FileService,
  ) {
    super(fileService);
  }

  async getFileById({ fileId, userId }: GetFileByIdArgs) {
    return this.getFileByIdUseCase.execute({ fileId, userId });
  }
}
