import { mapByKey } from '@common/utils';
import { File, FileService } from '@modules/files';
import { UserService } from '@modules/users/user.service';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Document } from '../document.model';
import { DocumentRepository } from '../document.repository';

export interface GetUserFilesArgs {
  userId: string;
}

export interface DocumentWithLatestFile extends Document {
  latestFile: File | null;
}

@Injectable()
export class GetManyFilesByUserIdUseCase {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    private readonly documentRepository: DocumentRepository,
  ) {}

  async execute({
    userId,
  }: GetUserFilesArgs): Promise<DocumentWithLatestFile[]> {
    const foundUser = await this.userService.getUserById({ userId });

    if (!foundUser) throw new NotFoundException('User not found');

    const documents = await this.documentRepository.getManyByUserId(userId);

    if (!documents.length) return [];

    const latestFiles = await this.fileService.getManyLatestByDocumentIds(
      documents.map((doc) => doc.id),
    );

    const filesByDocumentId = mapByKey(latestFiles, 'documentId');

    const documentsWithLatestFile = documents.map((document) => {
      const latestFile = filesByDocumentId[document.id] || null;

      return {
        ...document,
        latestFile,
      };
    });

    return documentsWithLatestFile;
  }
}
