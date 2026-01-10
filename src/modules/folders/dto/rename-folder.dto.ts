import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RenameFolderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
