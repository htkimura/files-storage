import { FileService, FileWithPresignedUrl } from '@modules/files';
import { UserService } from '@modules/users/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';

import { R2Service } from '../r2.service';

export interface GetBulkFilesByIdsArgs {
  ids: string[];
  userId: string;
}

@Injectable()
export class GetBulkFilesByIdsUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly r2Service: R2Service,
  ) {}

  async execute({
    ids,
    userId,
  }: GetBulkFilesByIdsArgs): Promise<FileWithPresignedUrl[]> {
    const foundUser = await this.userService.getUserById({ userId });

    if (!foundUser) throw new NotFoundException('User not found');

    const files = await this.fileService.getByIds(ids);

    const userFiles = files.filter((file) => file?.userId === userId);

    const presignedUrls = await this.r2Service.generateManyPresignedUrls(
      userFiles.map((file) => file.path),
    );

    return userFiles.map((file, index) => ({
      ...file,
      presignedUrl: presignedUrls[index],
    }));
  }
}
