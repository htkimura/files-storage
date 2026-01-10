import { AuthUser } from '@common/decorators';
import { AuthGuard } from '@common/guards';
import { JUser } from '@common/types';
import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CreateFolderDto, RenameFolderDto, UpdateParentFolderDto } from './dto';
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

  @Patch(':id/rename')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'renameFolder',
    summary: 'Rename a folder',
    description: 'Renames a folder belonging to the authenticated user',
  })
  @ApiResponse({
    status: 200,
    type: Folder,
  })
  renameFolder(
    @Param('id') id: string,
    @Body() input: RenameFolderDto,
    @AuthUser() user: JUser,
  ) {
    return this.folderService.renameFolder({
      userId: user._id,
      folderId: id,
      name: input.name,
    });
  }

  @Put(':id/parent')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'updateParentFolder',
    summary: 'Update folder parent',
    description:
      'Moves a folder to another folder or removes it from its parent folder. Set parentFolderId to null to remove from parent folder.',
  })
  @ApiResponse({
    status: 200,
    type: Folder,
  })
  updateParentFolder(
    @Param('id') id: string,
    @Body() input: UpdateParentFolderDto,
    @AuthUser() user: JUser,
  ) {
    return this.folderService.updateParentFolder({
      userId: user._id,
      folderId: id,
      parentFolderId: input.parentFolderId ?? null,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'deleteFolder',
    summary: 'Delete a folder',
    description: 'Deletes a folder belonging to the authenticated user',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  deleteFolder(@Param('id') id: string, @AuthUser() user: JUser) {
    return this.folderService.deleteFolder({ userId: user._id, folderId: id });
  }
}
