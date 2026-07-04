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

  async getById(id: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return this.transformUser(user);
  }

  async updateById(id: string, data: Partial<User>) {
    const user = await this.prismaService.user.update({
      where: { id },
      data,
    });

    return this.transformUser(user);
  }

  async adjustStorageConsumedCount(userId: string, deltaBytes: number) {
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: { storageConsumedCount: { increment: deltaBytes } },
    });

    return this.transformUser(user);
  }

  async setStorageConsumedCount(userId: string, count: number) {
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: { storageConsumedCount: count },
    });

    return this.transformUser(user);
  }

  transformUser(user: PrismaUser, includePassword?: boolean) {
    const { password, ...userWithoutPassword } = user;

    const baseUserWithoutPassword = {
      ...userWithoutPassword,
      _id: user.id,
      storageConsumedCount: user.storageConsumedCount ?? 0,
    };

    if (!includePassword) return baseUserWithoutPassword;

    return { ...baseUserWithoutPassword, password };
  }
}
