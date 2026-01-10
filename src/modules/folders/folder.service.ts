import { Injectable } from '@nestjs/common';

import { FolderRepository } from './folder.repository';

@Injectable()
export class FolderService extends FolderRepository {}
