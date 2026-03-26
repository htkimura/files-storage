import { File } from '@modules/files';
import { ApiProperty } from '@nestjs/swagger';

export class InitMultipartUploadOutput {
  @ApiProperty({ type: File })
  file: File;
}

export class MultipartPartUrlOutput {
  @ApiProperty()
  presignedUrl: string;
}
