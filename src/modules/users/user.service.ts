import { Injectable } from '@nestjs/common';

import { CreateUserDto, LoginDto, RefreshTokenDto } from './dto';
import {
  AssertStorageForUploadUseCase,
  CreateUserUseCase,
  GetManyFilesByUserIdUseCase,
  GetMeUseCase,
  GetUserByIdArgs,
  GetUserByIdUseCase,
  GetUserFilesArgs,
  LoginUseCase,
  RecalculateStorageConsumedUseCase,
  RefreshTokenUseCase,
} from './use-cases';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getMeUseCase: GetMeUseCase,
    private readonly getManyFilesByUserIdUseCase: GetManyFilesByUserIdUseCase,
    private readonly recalculateStorageConsumedUseCase: RecalculateStorageConsumedUseCase,
    private readonly assertStorageForUploadUseCase: AssertStorageForUploadUseCase,
    private readonly userRepository: UserRepository,
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

  getMe(input: GetUserByIdArgs) {
    return this.getMeUseCase.execute(input);
  }

  getUserFiles(input: GetUserFilesArgs) {
    return this.getManyFilesByUserIdUseCase.execute(input);
  }

  adjustStorageConsumedCount(userId: string, deltaBytes: number) {
    return this.userRepository.adjustStorageConsumedCount(userId, deltaBytes);
  }

  assertStorageForUpload(userId: string, additionalBytes: number) {
    return this.assertStorageForUploadUseCase.execute({
      userId,
      additionalBytes,
    });
  }

  recalculateStorageConsumed(userId: string) {
    return this.recalculateStorageConsumedUseCase.execute({ userId });
  }
}
