import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcryptjs';

@Injectable()
export class CryptService {
  async encrypt(value: string): Promise<string> {
    const salt = await genSalt(5);
    return hash(value, salt);
  }

  compare(value: string, hashedValue: string): Promise<boolean> {
    return compare(value, hashedValue);
  }
}
