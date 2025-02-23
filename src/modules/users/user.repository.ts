import { BaseRepositoryPrisma } from '@common/classes';
import { User as PrismaUser } from '@modules/prisma';
import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto';
import { User } from './user.model';

export interface UserWithPassword extends User {
  password: string;
}

@Injectable()
export class UserRepository extends BaseRepositoryPrisma(User, 'user') {
  async createUser(input: CreateUserDto): Promise<User> {
    const user = await this.prismaService.user.create({
      data: input,
    });

    return this.format(this.transformUser(user));
  }

  async getByEmail(
    email: string,
    includePassword?: boolean,
  ): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return this.format(this.transformUser(user, includePassword));
  }

  async getById(id: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return this.format(this.transformUser(user));
  }

  async updateById(id: string, data: Partial<User>) {
    const user = await this.prismaService.user.update({
      where: { id },
      data,
    });

    return this.format(this.transformUser(user));
  }

  transformUser(user: PrismaUser, includePassword?: boolean) {
    const { password, ...userWithoutPassword } = user;

    const baseUserWithoutPassword = { ...userWithoutPassword, id: user.id };

    if (!includePassword) return baseUserWithoutPassword;

    return { ...baseUserWithoutPassword, password };
  }
}
