import { AuthUser } from '@common/decorators';
import { AuthGuard } from '@common/guards';
import { JUser } from '@common/types';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CreateFolderDto } from './dto';
import { Folder } from './folder.model';
import { FolderService } from './folder.service';

@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'createFolder',
    summary: 'Create a new folder',
    description:
      'Creates a new folder for the authenticated user. Optionally, can specify a parent folder to create it inside.',
  })
  @ApiResponse({
    status: 201,
    type: Folder,
  })
  createFolder(@Body() input: CreateFolderDto, @AuthUser() user: JUser) {
    return this.folderService.createFolder({ userId: user._id, ...input });
  }
}
