import { Module } from '@nestjs/common';

import { AuthService } from './services';
import {
  CreateUserUseCase,
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
];

@Module({
  controllers: [UserController],
  exports: [AuthService, UserService],
  providers: [...useCases, AuthService, UserService, UserRepository],
})
export class UserModule {}
