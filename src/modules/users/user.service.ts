import { Injectable } from '@nestjs/common';

import { CreateUserDto, LoginDto } from './dto';
import { CreateUserUseCase, LoginUseCase } from './use-cases';

@Injectable()
export class UserService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  createUser(input: CreateUserDto) {
    return this.createUserUseCase.execute(input);
  }

  login(input: LoginDto) {
    return this.loginUseCase.execute(input);
  }
}
