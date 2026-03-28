import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private users: Map<string, User> = new Map();
  private emailIndex: Map<string, string> = new Map();
  private idCounter = 1;

  async create(userData: any): Promise<User> {
    const id = `user_${this.idCounter++}`;
    const user: User = {
      id,
      email: userData.email,
      username: userData.username || userData.email.split('@')[0],
      password: userData.password,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    this.emailIndex.set(user.email, id);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userId = this.emailIndex.get(email);
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }
}
