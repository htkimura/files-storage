import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProcessThumbnailTaskDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  fileId: string;
}
