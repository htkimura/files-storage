import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class InitMultipartUploadDto {
  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsString()
  fileType: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  fileSize: number;
}

export class MultipartUploadedPartDto {
  @ApiProperty({ minimum: 1, maximum: 10_000 })
  @IsInt()
  @Min(1)
  @Max(10_000)
  partNumber: number;

  @ApiProperty({
    description:
      'ETag returned from the part PUT response (with or without quotes)',
  })
  @IsString()
  etag: string;
}

export class CompleteMultipartUploadDto {
  @ApiProperty()
  @IsUUID()
  fileId: string;

  @ApiProperty({ type: [MultipartUploadedPartDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MultipartUploadedPartDto)
  parts: MultipartUploadedPartDto[];
}
