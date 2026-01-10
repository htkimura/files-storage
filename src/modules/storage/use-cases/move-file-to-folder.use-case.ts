import { File, FileService } from '@modules/files';
import { FolderService } from '@modules/folders/folder.service';
import { UserService } from '@modules/users/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';

import { MoveFileToFolderDto } from '../dto';

export interface MoveFileToFolderArgs extends MoveFileToFolderDto {
  fileId: string;
  userId: string;
}

@Injectable()
export class MoveFileToFolderUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly folderService: FolderService,
  ) {}

  async execute({
    fileId,
    folderId,
    userId,
  }: MoveFileToFolderArgs): Promise<File> {
    const foundUser = await this.userService.getUserById({ userId });

    if (!foundUser) throw new NotFoundException('User not found');

    const file = await this.fileService.getById(fileId);

    if (file?.userId !== userId) {
      throw new NotFoundException('File not found');
    }

    const oldFolderId = file.folderId || null;
    const newFolderId = folderId ?? null;

    // Fetch involved folders for validation and later updates
    const [oldFolder, newFolder] = await Promise.all([
      oldFolderId
        ? this.folderService.getById(oldFolderId)
        : Promise.resolve(null),
      newFolderId
        ? this.folderService.getById(newFolderId)
        : Promise.resolve(null),
    ]);

    // Validate new folder if moving to one
    if (newFolderId !== null) {
      if (!newFolder || newFolder.userId !== userId) {
        throw new NotFoundException('Folder not found');
      }
    }

    // Update the file's folderId
    const updatedFile = await this.fileService.update(fileId, {
      folderId: newFolderId,
    });

    // Update updatedAt of all involved folders
    const folderUpdatePromises: Promise<unknown>[] = [];

    // Update old folder if file was in one
    if (oldFolderId !== null && oldFolder) {
      // Update with same name to trigger updatedAt change
      folderUpdatePromises.push(
        this.folderService.update(oldFolderId, { name: oldFolder.name }),
      );
    }

    // Update new folder if moving to one
    if (newFolderId !== null && newFolder) {
      // Update with same name to trigger updatedAt change
      folderUpdatePromises.push(
        this.folderService.update(newFolderId, { name: newFolder.name }),
      );
    }

    // Wait for all folder updates to complete
    await Promise.all(folderUpdatePromises);

    return updatedFile;
  }
}
