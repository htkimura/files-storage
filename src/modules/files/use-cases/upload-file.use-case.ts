import { DocumentService } from '@modules/documents';
import { StorageService } from '@modules/storage';
import { UserService } from '@modules/users/user.service';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { uuid } from 'uuidv4';

import { UploadFileDto } from '../dto';
import { FileRepository } from '../file.repository';

export interface UploadFileArgs extends UploadFileDto {
  file: Express.Multer.File;
  userId: string;
}

interface UpdateAndGetUrlArgs {
  documentId: string;
  fileId: string;
  filePath: string;
  userId: string;
  file: Express.Multer.File;
}

@Injectable()
export class UploadFileUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly storageService: StorageService,
    @Inject(forwardRef(() => DocumentService))
    private readonly documentService: DocumentService,
    private readonly fileRepository: FileRepository,
  ) {}

  private updateAndGetUrl = async ({
    documentId,
    fileId,
    filePath,
    userId,
    file,
  }: UpdateAndGetUrlArgs) => {
    console.log('[updateAndGetUrl]', documentId);
    const presignedUrl = await this.storageService.uploadObject(file, userId);
    console.log('[presignedUrl]', presignedUrl);
    await this.documentService.updateById(documentId, {
      latestVersionId: fileId,
    });
    console.log('[depois documentService.updateById]');

    await this.fileRepository.create({
      documentId,
      path: filePath,
      userId,
    });
    console.log('[depois fileRepository.create]');
    // const [presignedUrl] = await Promise.all([
    //   this.storageService.uploadObject(file, userId),
    //   this.documentService.updateById(documentId, {
    //     latestVersionId: fileId,
    //   }),
    //   this.fileRepository.create({
    //     documentId,
    //     path: filePath,
    //     userId,
    //   }),
    // ]);

    return presignedUrl;
  };

  async execute({
    userId,
    file,
    document: documentInput,
    documentId,
    folderId,
  }: UploadFileArgs): Promise<string> {
    const foundUser = await this.userService.getUserById({ userId });

    if (!foundUser) throw new NotFoundException('User not found');

    if (!documentInput && !documentId) {
      throw new BadRequestException('Document or documentId is required');
    }

    const fileId = uuid();
    const filePath = this.storageService.generatePath(
      userId,
      file.originalname,
      fileId,
    );

    console.log('[documentId]', documentId);

    if (documentId) {
      const foundDocument = await this.documentService.getById(documentId);

      if (!foundDocument) {
        throw new NotFoundException('Document not found');
      }

      const presignedUrl = await this.updateAndGetUrl({
        documentId,
        file,
        fileId,
        filePath,
        userId,
      });

      return presignedUrl;
    }

    const foundDocument = await this.documentService.getByUnique({
      title: documentInput.title,
      userId,
    });

    console.log('[foundDocument]', foundDocument);

    if (foundDocument) {
      const presignedUrl = await this.updateAndGetUrl({
        documentId: foundDocument.id,
        file,
        fileId,
        filePath,
        userId,
      });

      return presignedUrl;
    }

    const [createdDocument, presignedUrl] = await Promise.all([
      this.documentService.create({
        ...documentInput,
        latestVersionId: fileId,
        folderId,
        userId,
      }),
      this.storageService.uploadObject(file, userId),
    ]);

    await this.fileRepository.create({
      documentId: createdDocument.id,
      path: filePath,
      userId,
    });

    return presignedUrl;
  }
}
