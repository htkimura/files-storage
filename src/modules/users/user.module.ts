import { Module } from '@nestjs/common';

import { AuthService } from './services';
import { CreateUserUseCase, LoginUseCase } from './use-cases';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

const useCases = [CreateUserUseCase, LoginUseCase];

@Module({
  controllers: [UserController],
  exports: [AuthService],
  providers: [...useCases, AuthService, UserService, UserRepository],
})
export class UserModule {}
