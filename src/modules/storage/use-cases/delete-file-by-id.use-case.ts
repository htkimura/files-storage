import { FileService } from '@modules/files';
import { UserService } from '@modules/users/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';

import { R2Service } from '../r2.service';

export interface DeleteFileByIdArgs {
  fileId: string;
  userId: string;
}

@Injectable()
export class DeleteFileByIdUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly r2Service: R2Service,
  ) {}

  async execute({ fileId, userId }: DeleteFileByIdArgs): Promise<boolean> {
    const foundUser = await this.userService.getUserById({ userId });

    if (!foundUser) throw new NotFoundException('User not found');

    const file = await this.fileService.getById(fileId);

    if (file?.userId !== userId) throw new NotFoundException('File not found');

    await this.r2Service.deleteFile(file.path);

    await this.fileService.deleteById(fileId);

    return true;
  }
}
