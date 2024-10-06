import { Injectable } from '@nestjs/common';

import { R3Service } from './r3.service';

@Injectable()
export class StorageService {
  constructor(private readonly r3Service: R3Service) {}

  getObjectPublicUrl(userId: string, objectName: string): any {
    return this.r3Service.getObjectPublicUrl(userId, objectName);
  }
}
