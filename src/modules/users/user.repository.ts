import { PrismaService, User as PrismaUser } from '@modules/prisma';
import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto';
import { User } from './user.model';

export interface UserWithPassword extends User {
  password: string;
}

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(input: CreateUserDto): Promise<User> {
    const user = await this.prismaService.user.create({
      data: input,
    });

    return this.transformUser(user);
  }

  async getByEmail(
    email: string,
    includePassword?: boolean,
  ): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return this.transformUser(user, includePassword);
  }

  transformUser(user: PrismaUser, includePassword?: boolean) {
    const { password, ...userWithoutPassword } = user;

    const baseUserWithoutPassword = { ...userWithoutPassword, _id: user.id };

    if (!includePassword) return baseUserWithoutPassword;

    return { ...baseUserWithoutPassword, password };
  }
}
