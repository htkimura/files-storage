import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

export class ListMyFoldersDto {
  @ApiPropertyOptional({
    description:
      'Filter by parent folder. Omit to return all folders. Pass null for root-level folders only.',
    nullable: true,
  })
  @Transform(({ value }) => {
    if (value === undefined) return undefined;
    if (value === 'null' || value === null) return null;
    return value;
  })
  @IsOptional()
  @IsUUID()
  parentFolderId?: string | null;
}
