import { FileModule } from '@modules/files';
import { FolderModule } from '@modules/folders';
import { StorageModule } from '@modules/storage';
import { Module } from '@nestjs/common';

import { AuthService } from './services';
import {
  AssertStorageForUploadUseCase,
  CreateUserUseCase,
  GetManyFilesByUserIdUseCase,
  GetMeUseCase,
  GetUserByIdUseCase,
  LoginUseCase,
  RecalculateStorageConsumedUseCase,
  RefreshTokenUseCase,
} from './use-cases';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

const useCases = [
  AssertStorageForUploadUseCase,
  CreateUserUseCase,
  LoginUseCase,
  RefreshTokenUseCase,
  GetUserByIdUseCase,
  GetMeUseCase,
  GetManyFilesByUserIdUseCase,
  RecalculateStorageConsumedUseCase,
];

@Module({
  imports: [FileModule, FolderModule, StorageModule],
  controllers: [UserController],
  exports: [AuthService, UserService],
  providers: [...useCases, AuthService, UserService, UserRepository],
})
export class UserModule {}
