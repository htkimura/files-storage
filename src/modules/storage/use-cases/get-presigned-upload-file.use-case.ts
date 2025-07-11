import { FileService } from '@modules/files';
import { UploadFileOutput } from '@modules/files/models';
import { UserService } from '@modules/users/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';

import { R2Service } from '../r2.service';

export interface GetPresignedUploadFileArgs {
  userId: string;
  rawFileInput: { name: string; type: string; size: number };
}

@Injectable()
export class GetPresignedUploadFileUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly r2Service: R2Service,
  ) {}

  async execute({
    userId,
    rawFileInput,
  }: GetPresignedUploadFileArgs): Promise<UploadFileOutput> {
    const foundUser = await this.userService.getUserById({ userId });

    if (!foundUser) throw new NotFoundException('User not found');

    const { id, key, presignedUploadUrl } =
      await this.r2Service.createPresignedUpload(userId, rawFileInput);

    const uploadedFile = await this.fileService.create({
      ...rawFileInput,
      userId,
      path: key,
      id,
    });

    return { file: uploadedFile, presignedUploadUrl };
  }
}
