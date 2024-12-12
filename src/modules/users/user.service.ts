import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto';
import { CreateUserUseCase } from './use-cases';

@Injectable()
export class UserService {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  createUser(input: CreateUserDto) {
    return this.createUserUseCase.execute(input);
  }
}
