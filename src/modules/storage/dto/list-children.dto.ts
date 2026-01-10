import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max } from 'class-validator';

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
}
