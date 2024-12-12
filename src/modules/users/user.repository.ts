import { PrismaService, User as PrismaUser } from '@modules/prisma';
import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto';
import { User } from './user.model';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(input: CreateUserDto): Promise<User> {
    const user = await this.prismaService.user.create({
      data: input,
    });

    return this.transformUser(user);
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return this.transformUser(user);
  }

  private transformUser(user: PrismaUser) {
    user.password = undefined;

    return { ...user, _id: user.id };
  }
}
