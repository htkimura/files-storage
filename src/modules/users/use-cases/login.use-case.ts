import { CryptService } from '@modules/global';
import { LoginDto } from '@modules/users/dto';
import { AuthService } from '@modules/users/services/auth.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserLogin } from '../user.model';
import { UserRepository, UserWithPassword } from '../user.repository';

export interface LoginArgs extends LoginDto {}

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptService: CryptService,
    private readonly authService: AuthService,
  ) {}

  async execute({ email, password }: LoginDto): Promise<UserLogin> {
    const foundUser = (await this.userRepository.getByEmail(
      email,
      true,
    )) as UserWithPassword;

    if (!foundUser) throw new NotFoundException('User not found');

    const isPasswordCorrect = await this.cryptService.compare(
      password,
      foundUser.password,
    );

    if (!isPasswordCorrect) {
      throw new BadRequestException('Wrong password');
    }

    const transformedUser = this.userRepository.transformUser(foundUser);

    const response = this.authService.getUserLoginPayload(transformedUser);

    await this.userRepository.updateById(foundUser.id, {
      refreshToken: response.refreshToken,
    });

    return response;
  }
}
