import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() input: CreateUserDto) {
    return this.userService.createUser(input);
  }

  @Post('login')
  login(@Body() input: CreateUserDto) {
    return this.userService.login(input);
  }
}
