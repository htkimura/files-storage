import { Injectable } from '@nestjs/common';

import { CreateUserDto, LoginDto, RefreshTokenDto } from './dto';
import {
  CreateUserUseCase,
  GetManyFilesByUserIdUseCase,
  GetUserByIdArgs,
  GetUserByIdUseCase,
  GetUserFilesArgs,
  LoginUseCase,
  RefreshTokenUseCase,
} from './use-cases';

@Injectable()
export class UserService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getManyFilesByUserIdUseCase: GetManyFilesByUserIdUseCase,
  ) {}

  createUser(input: CreateUserDto) {
    return this.createUserUseCase.execute(input);
  }

  login(input: LoginDto) {
    return this.loginUseCase.execute(input);
  }

  refreshToken(input: RefreshTokenDto) {
    return this.refreshTokenUseCase.execute(input);
  }

  getUserById(input: GetUserByIdArgs) {
    return this.getUserByIdUseCase.execute(input);
  }

  getUserFiles(input: GetUserFilesArgs) {
    return this.getManyFilesByUserIdUseCase.execute(input);
  }
}
