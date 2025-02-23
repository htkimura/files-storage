import { AuthService } from '@modules/users/services/auth.service';
import { BadRequestException, Injectable } from '@nestjs/common';

import { UserLogin } from '../user.model';
import { UserRepository } from '../user.repository';

interface RefreshTokenArgs {
  refreshToken: string;
}

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute({ refreshToken }: RefreshTokenArgs): Promise<UserLogin | null> {
    const isValid = this.authService.verifyRefreshToken(refreshToken);

    if (!isValid.user) return null;

    const user = await this.userRepository.getById(isValid.user.id);

    if (refreshToken !== user.refreshToken) {
      throw new BadRequestException('Invalid refresh token');
    }

    const response = this.authService.getUserLoginPayload(user);
    await this.userRepository.updateById(user.id, {
      refreshToken: response.refreshToken,
    });
    return response;
  }
}
