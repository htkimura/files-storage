import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class DeleteBulkFilesOutput {
  @ApiProperty()
  deleted: string[];

  @ApiProperty()
  failed: string[];
}
