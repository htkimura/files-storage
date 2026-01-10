import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class MoveFileToFolderDto {
  @ApiPropertyOptional({
    description:
      'ID of the folder to move this file into. Set to null to remove from folder.',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  folderId?: string | null;
}
