import { Injectable, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

interface StorageData {
  users: Record<string, any>;
  emailToId: Record<string, string>;
  usernameToId: Record<string, string>;
  idCounter: number;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private users: Map<string, any> = new Map();
  private emailToId: Map<string, string> = new Map();
  private usernameToId: Map<string, string> = new Map();
  private idCounter = 1;
  private readonly dataFilePath: string;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    this.dataFilePath = path.join(__dirname, '../../data/users.json');
  }

  onModuleInit() {
    this.loadFromFile();
  }

  private loadFromFile() {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const data = fs.readFileSync(this.dataFilePath, 'utf-8');
        const parsed: StorageData = JSON.parse(data);
        
        // 从对象恢复 Map
        this.users = new Map(Object.entries(parsed.users || {}));
        this.emailToId = new Map(Object.entries(parsed.emailToId || {}));
        this.usernameToId = new Map(Object.entries(parsed.usernameToId || {}));
        this.idCounter = parsed.idCounter || 1;
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
      // 如果加载失败，使用空数据
      this.users = new Map();
      this.emailToId = new Map();
      this.usernameToId = new Map();
      this.idCounter = 1;
    }
  }

  private saveToFile() {
    try {
      // 确保目录存在
      const dir = path.dirname(this.dataFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Map 转对象
      const data: StorageData = {
        users: Object.fromEntries(this.users),
        emailToId: Object.fromEntries(this.emailToId),
        usernameToId: Object.fromEntries(this.usernameToId),
        idCounter: this.idCounter,
      };

      fs.writeFileSync(this.dataFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('保存用户数据失败:', error);
    }
  }

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
    
    // 保存到文件
    this.saveToFile();

    return this.login(user);
  }
}
