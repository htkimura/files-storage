import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

import { File } from '../file.model';

export class UploadFileOutput {
  @ApiProperty()
  file: File;

  @ApiProperty()
  presignedUploadUrl: string;
}
