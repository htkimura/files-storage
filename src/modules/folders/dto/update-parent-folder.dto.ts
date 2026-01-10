import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateParentFolderDto {
  @ApiPropertyOptional({
    description:
      'ID of the parent folder to move this folder into. Set to null to remove from parent folder.',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  parentFolderId?: string | null;
}
