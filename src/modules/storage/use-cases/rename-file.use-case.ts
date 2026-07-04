import { File, FileService } from '@modules/files';
import { Injectable, NotFoundException } from '@nestjs/common';

export interface RenameFileArgs {
  userId: string;
  fileId: string;
  name: string;
}

@Injectable()
export class RenameFileUseCase {
  constructor(private readonly fileService: FileService) {}

  async execute({ userId, fileId, name }: RenameFileArgs): Promise<File> {
    const file = await this.fileService.getById(fileId);

    if (file?.userId !== userId) {
      throw new NotFoundException('File not found');
    }

    return this.fileService.update(fileId, { name });
  }
}
