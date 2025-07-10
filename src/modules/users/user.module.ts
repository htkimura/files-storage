import { FileModule } from '@modules/files';
import { StorageModule } from '@modules/storage';
import { Module } from '@nestjs/common';

import { AuthService } from './services';
import {
  CreateUserUseCase,
  GetManyFilesByUserIdUseCase,
  GetUserByIdUseCase,
  LoginUseCase,
  RefreshTokenUseCase,
} from './use-cases';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

const useCases = [
  CreateUserUseCase,
  LoginUseCase,
  RefreshTokenUseCase,
  GetUserByIdUseCase,
  GetManyFilesByUserIdUseCase,
];

@Module({
  imports: [FileModule, StorageModule],
  controllers: [UserController],
  exports: [AuthService, UserService],
  providers: [...useCases, AuthService, UserService, UserRepository],
})
export class UserModule {}
