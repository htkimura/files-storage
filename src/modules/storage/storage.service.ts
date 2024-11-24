import { Injectable } from '@nestjs/common';

import { R2Service } from './r2.service';

@Injectable()
export class StorageService {
  constructor(private readonly r2Service: R2Service) {}

  getObjectPublicUrl(userId: string, objectName: string): any {
    return this.r2Service.getObjectPublicUrl(userId, objectName);
  }
}
