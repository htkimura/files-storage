import { FileFilterType } from '@common/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max } from 'class-validator';

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

  @ApiPropertyOptional({
    type: [FileFilterType],
    enum: FileFilterType,
    enumName: 'FileFilterType',
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value];
    }
    return value;
  })
  @IsOptional()
  @IsEnum(FileFilterType, { each: true })
  filterType?: FileFilterType[];
}
