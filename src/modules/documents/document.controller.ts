import { AuthUser } from '@common/decorators';
import { AuthGuard } from '@common/guards';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { DocumentService } from './document.service';

@ApiTags('Documents')
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'myFiles',
    summary: 'Get the authenticated user files URLs',
    description: 'Returns the authenticated user files URLs',
  })
  @ApiResponse({
    status: 200,
    type: [String],
  })
  myDocuments(@AuthUser('id') userId: string) {
    return this.documentService.getUserDocuments({ userId });
  }
}
