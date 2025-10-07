import { mapByKey } from '@common/utils';
import { FileService } from '@modules/files';
import { DeleteBulkFilesOutput } from '@modules/files/models/delete-bulk-files.model';
import { UserService } from '@modules/users/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';

import { R2Service } from '../r2.service';

export interface DeleteBulkFilesByIdsArgs {
  ids: string[];
  userId: string;
}

@Injectable()
export class DeleteBulkFilesByIdsUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly r2Service: R2Service,
  ) {}

  async execute({
    ids,
    userId,
  }: DeleteBulkFilesByIdsArgs): Promise<DeleteBulkFilesOutput> {
    const foundUser = await this.userService.getUserById({ userId });

    if (!foundUser) throw new NotFoundException('User not found');

    const files = await this.fileService.getByIds(ids);

    const deletableFiles = files.filter((file) => file.userId === userId);

    if (deletableFiles.length === 0)
      throw new NotFoundException('Files not found');

    const { deletedKeys, errors } = await this.r2Service.deleteBulkFiles(
      deletableFiles.map((file) => file.path),
    );

    const filesByPath = mapByKey(deletableFiles, 'path');

    const failedFilesIds = errors?.map((error) => filesByPath[error].id) || [];

    if (deletedKeys.length === 0) {
      return { deleted: [], failed: failedFilesIds };
    }

    await Promise.all([
      this.fileService.deleteBulkByPaths(deletedKeys),
      this.r2Service.deleteBulkFiles(
        deletableFiles.map((file) => file.thumbnailPath).filter(Boolean),
      ),
    ]);

    const deleteFilesIds = deletedKeys?.map((key) => filesByPath[key].id) || [];

    return { deleted: deleteFilesIds, failed: failedFilesIds };
  }
}
