import { Injectable } from '@nestjs/common';

import { R2Service } from './r2.service';

@Injectable()
export class StorageService extends R2Service {}
