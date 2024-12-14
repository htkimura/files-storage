import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDto, LoginDto, RefreshTokenDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() input: CreateUserDto) {
    return this.userService.createUser(input);
  }

  @Post('login')
  login(@Body() input: LoginDto) {
    return this.userService.login(input);
  }

  @Post('refresh-token')
  refreshToken(@Body() input: RefreshTokenDto) {
    return this.userService.refreshToken(input);
  }
}
