import { AuthUser } from '@common/decorators';
import { AuthGuard } from '@common/guards';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Folder } from './folder.model';
import { FolderService } from './folder.service';

@ApiTags('Folders')
@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'getUserFolders',
    summary: 'Get the authenticated user folders',
    description: 'Get the authenticated user folders',
  })
  @ApiResponse({
    status: 200,
    type: [Folder],
  })
  getUserFolders(@AuthUser('id') userId: string) {
    return this.folderService.getUserManyFolder(userId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'createUserFolders',
    summary: 'Create the authenticated user folder',
    description: 'Create the authenticated user folder',
  })
  @ApiResponse({
    status: 200,
    type: Folder,
  })
  myDocuments(@AuthUser('id') userId: string, @Body() input: any) {
    return this.folderService.create({ ...input, userId });
  }
}
