import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, password: string): Promise<any> {
    // 支持用户名或邮箱登录
    const user = await this.usersService.findByUsername(identifier) || 
                 await this.usersService.findByEmail(identifier);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        level: user.level,
        role: user.role,
      },
    };
  }

  async register(registerDto: any) {
    const { username, email, password } = registerDto;
    
    // 检查用户名是否已存在
    const existingUserByUsername = await this.usersService.findByUsername(username);
    if (existingUserByUsername) {
      throw new UnauthorizedException('Username already exists');
    }
    
    // 检查邮箱是否已存在
    const existingUserByEmail = await this.usersService.findByEmail(email);
    if (existingUserByEmail) {
      throw new UnauthorizedException('Email already exists');
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 创建用户
    const user = await this.usersService.create({
      username,
      email,
      password: hashedPassword,
    });
    
    const { password: _, ...result } = user;
    return result;
  }
}
