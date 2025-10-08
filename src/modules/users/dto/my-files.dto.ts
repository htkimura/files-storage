import { FileFilterType } from '@common/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsObject,
  IsOptional,
  Max,
  ValidateNested,
} from 'class-validator';

export class FileFilters {
  type?: FileFilterType[];
}

export class MyFilesDto {
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

  @ApiPropertyOptional({ type: FileFilters })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => FileFilters)
  filters?: FileFilters;
}
