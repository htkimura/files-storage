import { ApiProperty } from '@nestjs/swagger';

export class PaginationOutput {
  @ApiProperty()
  page: number;

  @ApiProperty()
  size: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  hasMore: boolean;
}
