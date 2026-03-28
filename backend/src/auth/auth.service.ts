import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private users: Map<string, any> = new Map();
  private emailToId: Map<string, string> = new Map();
  private usernameToId: Map<string, string> = new Map();
  private idCounter = 1;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, password: string): Promise<any> {
    // 先通过邮箱查找
    let userId = this.emailToId.get(identifier);
    // 如果邮箱没找到，尝试通过用户名查找
    if (!userId) {
      userId = this.usernameToId.get(identifier);
    }
    
    if (userId) {
      const user = this.users.get(userId);
      if (user && await bcrypt.compare(password, user.password)) {
        const { password, ...result } = user;
        return result;
      }
    }
    throw new UnauthorizedException('用户名或密码错误');
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async register(userData: any) {
    // 检查邮箱是否已被注册
    if (this.emailToId.has(userData.email)) {
      throw new UnauthorizedException('邮箱已被注册');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const id = `user_${this.idCounter++}`;
    const user = {
      id,
      email: userData.email,
      username: userData.username || userData.email.split('@')[0],
      password: hashedPassword,
      createdAt: new Date(),
    };

    this.users.set(id, user);
    this.emailToId.set(user.email, id);
    this.usernameToId.set(user.username, id);

    return this.login(user);
  }
}
