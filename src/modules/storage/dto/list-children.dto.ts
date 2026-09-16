import { FileSortField, SortDirection } from '@common/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max } from 'class-validator';

export class ListChildrenDto {
  @ApiProperty({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page: number = 1;

  @ApiProperty({ default: 20 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Max(20)
  size: number = 20;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  parentFolderId?: string;

  @ApiPropertyOptional({
    enum: FileSortField,
    enumName: 'FileSortField',
    default: FileSortField.DATE,
  })
  @IsOptional()
  @IsEnum(FileSortField)
  sortBy?: FileSortField = FileSortField.DATE;

  @ApiPropertyOptional({
    enum: SortDirection,
    enumName: 'SortDirection',
    default: SortDirection.DESC,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  sortOrder?: SortDirection = SortDirection.DESC;
}
