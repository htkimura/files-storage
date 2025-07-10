import { FileService, FileWithPresignedUrl } from '@modules/files';
import { UserService } from '@modules/users/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';

import { R2Service } from '../r2.service';

export interface GetFileByIdArgs {
  fileId: string;
  userId: string;
}

@Injectable()
export class GetFileByIdUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly r2Service: R2Service,
  ) {}

  async execute({
    fileId,
    userId,
  }: GetFileByIdArgs): Promise<FileWithPresignedUrl> {
    const foundUser = await this.userService.getUserById({ userId });

    if (!foundUser) throw new NotFoundException('User not found');

    const file = await this.fileService.getById(fileId);

    if (file?.userId !== userId) throw new NotFoundException('File not found');

    const presignedUrl = await this.r2Service.generateReadPresignedUrl(
      file.path,
    );

    return { ...file, presignedUrl };
  }
}
