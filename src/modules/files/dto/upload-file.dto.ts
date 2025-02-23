import { ApiPropertyOptional } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiPropertyOptional()
  documentId?: string;

  @ApiPropertyOptional()
  document?: {
    title: string;
    description?: string;
  };

  @ApiPropertyOptional()
  folderId?: string;
}
