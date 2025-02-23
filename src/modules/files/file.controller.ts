import { AuthUser } from '@common/decorators';
import { AuthGuard } from '@common/guards';
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { UploadFileDto } from './dto';
import { FileService } from './file.service';

@ApiTags('Files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  // TODO: swagger
  @Post('')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadObject(
    @AuthUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadFileDto,
  ): Promise<string> {
    const parsedDocument = body.document
      ? JSON.parse(body.document as unknown as string)
      : undefined;

    return this.fileService.upload({
      ...body,
      file,
      userId,
      document: parsedDocument,
    });
  }
}
