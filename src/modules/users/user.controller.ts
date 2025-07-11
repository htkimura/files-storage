import { AuthUser } from '@common/decorators';
import { AuthGuard } from '@common/guards';
import { File } from '@modules/files';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CreateUserDto, LoginDto, RefreshTokenDto } from './dto';
import { User, UserLogin } from './user.model';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    operationId: 'createUser',
    summary: 'Sign up route where a user is created',
    description:
      "Creates a new user and returns the created user. We don't have plans for now to implement this on frontend, but it's here for testing purposes",
  })
  createUser(@Body() input: CreateUserDto) {
    return this.userService.createUser(input);
  }

  @Post('login')
  @ApiOperation({
    operationId: 'login',
    summary: 'Sign in route for authentication',
    description:
      'Receives user auth data, check the authentication and returns LoginData',
  })
  @ApiResponse({
    status: 200,
    type: UserLogin,
  })
  login(@Body() input: LoginDto): Promise<UserLogin> {
    return this.userService.login(input);
  }

  @Post('refresh-token')
  @ApiOperation({
    operationId: 'refreshToken',
    summary: 'Refreshes the user token',
    description:
      'Receives the user refresh token, validates it and return an updated token',
  })
  @ApiResponse({
    status: 200,
    type: UserLogin,
  })
  refreshToken(@Body() input: RefreshTokenDto) {
    return this.userService.refreshToken(input);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'me',
    summary: 'Get the authenticated user data',
    description:
      'Returns the authenticated user data using the token as reference',
  })
  @ApiResponse({
    status: 200,
    type: User,
  })
  me(@AuthUser('_id') userId: string) {
    return this.userService.getUserById({ userId });
  }

  @Get('me/files')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'myFiles',
    summary: 'Get the authenticated user files URLs',
    description: 'Returns the authenticated user files URLs',
  })
  @ApiResponse({
    status: 200,
    type: [File],
  })
  myFiles(
    @AuthUser('_id') userId: string,
    @Query('page') page = 1,
    @Query('limit') size = 20,
  ) {
    return this.userService.getUserFiles({ userId, page, size });
  }
}
