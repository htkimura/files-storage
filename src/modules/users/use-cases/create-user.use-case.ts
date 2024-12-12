import { CryptService } from '@modules/global';
import { Injectable } from '@nestjs/common';

import { CreateUserDto } from '../dto';
import { UserRepository } from '../user.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptService: CryptService,
  ) {}

  async execute(input: CreateUserDto) {
    const foundUser = await this.userRepository.getByEmail(input.email);

    if (foundUser) throw new Error('User already exists');

    const encryptedPassword = await this.cryptService.encrypt(input.password);

    const user = await this.userRepository.createUser({
      ...input,
      password: encryptedPassword,
    });

    return user;
  }
}
