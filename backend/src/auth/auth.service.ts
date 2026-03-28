import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  private idCounter = 1;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async validateUser(identifier: string, password: string): Promise<any> {
    // 先通过邮箱查找
    let user = await this.usersService.findByEmail(identifier);
    // 如果邮箱没找到，尝试通过用户名查找
    if (!user) {
      user = await this.usersService.findByUsername(identifier);
    }
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
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
    const existingEmail = await this.usersService.findByEmail(userData.email);
    if (existingEmail) {
      throw new UnauthorizedException('邮箱已被注册');
    }

    // 检查用户名是否已被注册
    const username = userData.username || userData.email.split('@')[0];
    const existingUsername = await this.usersService.findByUsername(username);
    if (existingUsername) {
      throw new UnauthorizedException('用户名已被注册');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const id = `user_${this.idCounter++}`;
    const user = this.usersRepository.create({
      id,
      email: userData.email,
      username,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);

    return this.login(savedUser);
  }
}
