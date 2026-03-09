import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    return { accessToken: "accessToken", refreshToken: "refreshToken" };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    return null;
  }
}
