#!/usr/bin/env python3
"""
魔兽世界Web MMO - 阶段一MVP代码生成器
自动生成完整的MVP功能代码
"""
import os
import json
from pathlib import Path

# 项目根目录
PROJECT_ROOT = Path(__file__).parent
BACKEND_DIR = PROJECT_ROOT / "backend"
FRONTEND_DIR = PROJECT_ROOT / "frontend"
SHARED_DIR = PROJECT_ROOT / "shared"

def load_game_data():
    """加载游戏数据"""
    with open(SHARED_DIR / "game-data.json", "r", encoding="utf-8") as f:
        return json.load(f)

def create_backend_structure():
    """创建后端目录结构"""
    modules = [
        "auth", "users", "characters", "battle", "skills", 
        "items", "dungeons", "game"
    ]
    
    for module in modules:
        module_dir = BACKEND_DIR / "src" / module
        module_dir.mkdir(parents=True, exist_ok=True)

def create_frontend_structure():
    """创建前端目录结构"""
    dirs = [
        "src/pages", "src/components", "src/store", "src/api", 
        "src/types", "src/utils", "src/styles"
    ]
    
    for d in dirs:
        (FRONTEND_DIR / d).mkdir(parents=True, exist_ok=True)

def generate_backend_app_module():
    """生成后端主模块"""
    content = '''import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CharactersModule } from './characters/characters.module';
import { BattleModule } from './battle/battle.module';
import { SkillsModule } from './skills/skills.module';
import { ItemsModule } from './items/items.module';
import { DungeonsModule } from './dungeons/dungeons.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CharactersModule,
    BattleModule,
    SkillsModule,
    ItemsModule,
    DungeonsModule,
    GameModule,
  ],
})
export class AppModule {}
'''
    with open(BACKEND_DIR / "src" / "app.module.ts", "w", encoding="utf-8") as f:
        f.write(content)

def generate_backend_auth_module():
    """生成认证模块"""
    # auth.module.ts
    auth_module = '''import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'wow-web-mmo-secret-key-2024',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
'''
    
    # auth.service.ts
    auth_service = '''import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
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
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });
    return this.login(user);
  }
}
'''
    
    # auth.controller.ts
    auth_controller = '''import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
'''
    
    # jwt.strategy.ts
    jwt_strategy = '''import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'wow-web-mmo-secret-key-2024',
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findById(payload.sub);
    return user;
  }
}
'''
    
    # local-auth.guard.ts
    local_auth_guard = '''import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
'''
    
    # jwt-auth.guard.ts
    jwt_auth_guard = '''import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
'''
    
    # local.strategy.ts
    local_strategy = '''import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }
    return user;
  }
}
'''
    
    # 写入文件
    auth_dir = BACKEND_DIR / "src" / "auth"
    auth_dir.mkdir(parents=True, exist_ok=True)
    
    with open(auth_dir / "auth.module.ts", "w", encoding="utf-8") as f:
        f.write(auth_module)
    with open(auth_dir / "auth.service.ts", "w", encoding="utf-8") as f:
        f.write(auth_service)
    with open(auth_dir / "auth.controller.ts", "w", encoding="utf-8") as f:
        f.write(auth_controller)
    with open(auth_dir / "jwt.strategy.ts", "w", encoding="utf-8") as f:
        f.write(jwt_strategy)
    with open(auth_dir / "local.strategy.ts", "w", encoding="utf-8") as f:
        f.write(local_strategy)
    with open(auth_dir / "local-auth.guard.ts", "w", encoding="utf-8") as f:
        f.write(local_auth_guard)
    with open(auth_dir / "jwt-auth.guard.ts", "w", encoding="utf-8") as f:
        f.write(jwt_auth_guard)

def generate_backend_users_module():
    """生成用户模块"""
    # users.module.ts
    users_module = '''import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
'''
    
    # users.service.ts
    users_service = '''import { Injectable } from '@nestjs/common';

interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  createdAt: Date;
}

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
'''
    
    # users.controller.ts
    users_controller = '''import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.id);
    const { password, ...result } = user;
    return result;
  }
}
'''
    
    # user.entity.ts
    user_entity = '''export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  createdAt: Date;
}
'''
    
    # 写入文件
    users_dir = BACKEND_DIR / "src" / "users"
    users_dir.mkdir(parents=True, exist_ok=True)
    
    with open(users_dir / "users.module.ts", "w", encoding="utf-8") as f:
        f.write(users_module)
    with open(users_dir / "users.service.ts", "w", encoding="utf-8") as f:
        f.write(users_service)
    with open(users_dir / "users.controller.ts", "w", encoding="utf-8") as f:
        f.write(users_controller)
    with open(users_dir / "user.entity.ts", "w", encoding="utf-8") as f:
        f.write(user_entity)

def generate_backend_characters_module():
    """生成角色模块"""
    # characters.module.ts
    characters_module = '''import { Module } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CharactersController } from './characters.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [CharactersService],
  controllers: [CharactersController],
  exports: [CharactersService],
})
export class CharactersModule {}
'''
    
    # characters.service.ts
    characters_service = '''import { Injectable } from '@nestjs/common';
import * as gameData from '../../../shared/game-data.json';

interface CharacterStats {
  strength: number;
  agility: number;
  stamina: number;
  intellect: number;
  spirit: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
}

interface Character {
  id: string;
  userId: string;
  name: string;
  class: string;
  spec: string;
  faction: 'alliance' | 'horde';
  level: number;
  experience: number;
  stats: CharacterStats;
  equipment: Record<string, any>;
  inventory: any[];
  talents: Record<string, number>;
  createdAt: Date;
}

@Injectable()
export class CharactersService {
  private characters: Map<string, Character> = new Map();
  private userCharacters: Map<string, string[]> = new Map();
  private idCounter = 1;

  private getClassData(classId: string) {
    return gameData.classes.classes.find(c => c.id === classId);
  }

  private calculateStats(classData: any, level: number): CharacterStats {
    const baseStats = { ...classData.stats };
    const levelMultiplier = 1 + (level - 1) * 0.1;
    
    const stats = {
      strength: Math.floor(baseStats.strength * levelMultiplier),
      agility: Math.floor(baseStats.agility * levelMultiplier),
      stamina: Math.floor(baseStats.stamina * levelMultiplier),
      intellect: Math.floor(baseStats.intellect * levelMultiplier),
      spirit: Math.floor(baseStats.spirit * levelMultiplier),
    };
    
    const maxHealth = stats.stamina * 10 + 100;
    const maxMana = stats.intellect * 5 + 50;
    
    return {
      ...stats,
      health: maxHealth,
      maxHealth,
      mana: maxMana,
      maxMana,
    };
  }

  async create(userId: string, characterData: any): Promise<Character> {
    const classData = this.getClassData(characterData.class);
    if (!classData) {
      throw new Error('职业不存在');
    }

    const id = `char_${this.idCounter++}`;
    const character: Character = {
      id,
      userId,
      name: characterData.name,
      class: characterData.class,
      spec: characterData.spec,
      faction: characterData.faction,
      level: 1,
      experience: 0,
      stats: this.calculateStats(classData, 1),
      equipment: {},
      inventory: [],
      talents: {},
      createdAt: new Date(),
    };

    this.characters.set(id, character);
    
    if (!this.userCharacters.has(userId)) {
      this.userCharacters.set(userId, []);
    }
    this.userCharacters.get(userId)!.push(id);

    return character;
  }

  async findByUser(userId: string): Promise<Character[]> {
    const charIds = this.userCharacters.get(userId) || [];
    return charIds.map(id => this.characters.get(id)!).filter(Boolean);
  }

  async findById(id: string): Promise<Character | null> {
    return this.characters.get(id) || null;
  }

  async update(id: string, updateData: Partial<Character>): Promise<Character | null> {
    const character = this.characters.get(id);
    if (!character) return null;
    
    Object.assign(character, updateData);
    return character;
  }

  async addExperience(id: string, amount: number): Promise<Character | null> {
    const character = this.characters.get(id);
    if (!character) return null;

    character.experience += amount;
    const expNeeded = character.level * 1000;
    
    while (character.experience >= expNeeded) {
      character.experience -= expNeeded;
      character.level += 1;
      
      const classData = this.getClassData(character.class);
      character.stats = this.calculateStats(classData, character.level);
    }

    return character;
  }
}
'''
    
    # characters.controller.ts
    characters_controller = '''import { Controller, Get, Post, Put, Body, UseGuards, Request, Param } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('characters')
export class CharactersController {
  constructor(private charactersService: CharactersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() characterData: any) {
    return this.charactersService.create(req.user.id, characterData);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findByUser(@Request() req) {
    return this.charactersService.findByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.charactersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.charactersService.update(id, updateData);
  }
}
'''
    
    # character.entity.ts
    character_entity = '''export interface CharacterStats {
  strength: number;
  agility: number;
  stamina: number;
  intellect: number;
  spirit: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
}

export interface Character {
  id: string;
  userId: string;
  name: string;
  class: string;
  spec: string;
  faction: 'alliance' | 'horde';
  level: number;
  experience: number;
  stats: CharacterStats;
  equipment: Record<string, any>;
  inventory: any[];
  talents: Record<string, number>;
  createdAt: Date;
}
'''
    
    # 写入文件
    chars_dir = BACKEND_DIR / "src" / "characters"
    chars_dir.mkdir(parents=True, exist_ok=True)
    
    with open(chars_dir / "characters.module.ts", "w", encoding="utf-8") as f:
        f.write(characters_module)
    with open(chars_dir / "characters.service.ts", "w", encoding="utf-8") as f:
        f.write(characters_service)
    with open(chars_dir / "characters.controller.ts", "w", encoding="utf-8") as f:
        f.write(characters_controller)
    with open(chars_dir / "character.entity.ts", "w", encoding="utf-8") as f:
        f.write(character_entity)

def generate_backend_battle_module():
    """生成战斗模块"""
    # battle.module.ts
    battle_module = '''import { Module } from '@nestjs/common';
import { BattleService } from './battle.service';
import { BattleController } from './battle.controller';
import { CharactersModule } from '../characters/characters.module';
import { SkillsModule } from '../skills/skills.module';

@Module({
  imports: [CharactersModule, SkillsModule],
  providers: [BattleService],
  controllers: [BattleController],
  exports: [BattleService],
})
export class BattleModule {}
'''
    
    # battle.service.ts
    battle_service = '''import { Injectable } from '@nestjs/common';
import { CharactersService } from '../characters/characters.service';
import { SkillsService } from '../skills/skills.service';
import * as gameData from '../../../shared/game-data.json';

interface BattleActor {
  id: string;
  type: 'player' | 'enemy';
  name: string;
  class?: string;
  level: number;
  health: number;
  maxHealth: number;
  resource: number;
  maxResource: number;
  resourceType: string;
  stats: any;
  isPlayer?: boolean;
  talentBonus?: any;
  buffs?: any[];
  debuffs?: any[];
}

interface BattleLog {
  type: string;
  actorId: string;
  targetId?: string;
  skillId?: string;
  value?: number;
  message: string;
  timestamp: number;
}

interface BattleState {
  id: string;
  actors: BattleActor[];
  turn: number;
  currentActorId: string;
  logs: BattleLog[];
  isOver: boolean;
  winner?: 'player' | 'enemy';
  rewards?: any;
}

@Injectable()
export class BattleService {
  private battles: Map<string, BattleState> = new Map();
  private idCounter = 1;

  constructor(
    private charactersService: CharactersService,
    private skillsService: SkillsService,
  ) {}

  private createEnemy(dungeonId: string, enemyIndex: number): BattleActor {
    const enemies = [
      { name: '怒焰穴居人', level: 2, health: 150, class: 'warrior' },
      { name: '灼热的元素怪', level: 4, health: 200, class: 'shaman' },
      { name: '奥格弗林特', level: 6, health: 350, class: 'warrior' },
      { name: '塔拉加曼', level: 8, health: 500, class: 'shaman' },
    ];
    
    const enemy = enemies[Math.min(enemyIndex, enemies.length - 1)];
    return {
      id: `enemy_${enemyIndex}`,
      type: 'enemy',
      name: enemy.name,
      class: enemy.class,
      level: enemy.level,
      health: enemy.health,
      maxHealth: enemy.health,
      resource: 100,
      maxResource: 100,
      resourceType: 'rage',
      stats: {
        strength: 20 + enemy.level * 5,
        agility: 15 + enemy.level * 3,
        stamina: 25 + enemy.level * 4,
        intellect: 10 + enemy.level * 2,
        spirit: 8 + enemy.level * 2,
      },
      buffs: [],
      debuffs: [],
    };
  }

  async startPVEBattle(characterId: string, dungeonId: string): Promise<BattleState> {
    const character = await this.charactersService.findById(characterId);
    if (!character) {
      throw new Error('角色不存在');
    }

    const playerActor: BattleActor = {
      id: 'player',
      type: 'player',
      name: character.name,
      class: character.class,
      level: character.level,
      health: character.stats.health,
      maxHealth: character.stats.maxHealth,
      resource: character.class === 'warrior' ? 0 : character.stats.mana,
      maxResource: character.class === 'warrior' ? 100 : character.stats.maxMana,
      resourceType: character.class === 'warrior' ? 'rage' : 'mana',
      stats: character.stats,
      isPlayer: true,
      buffs: [],
      debuffs: [],
    };

    const enemies = [this.createEnemy(dungeonId, 0)];
    
    const battleId = `battle_${this.idCounter++}`;
    const battle: BattleState = {
      id: battleId,
      actors: [playerActor, ...enemies],
      turn: 1,
      currentActorId: this.getFirstActor([playerActor, ...enemies]),
      logs: [],
      isOver: false,
    };

    this.addLog(battle, {
      type: 'battle_start',
      actorId: 'system',
      message: `战斗开始！${playerActor.name} 遇到了 ${enemies.map(e => e.name).join('、')}`,
    });

    this.battles.set(battleId, battle);
    return battle;
  }

  private getFirstActor(actors: BattleActor[]): string {
    return actors.sort((a, b) => b.stats.agility - a.stats.agility)[0].id;
  }

  private addLog(battle: BattleState, log: Omit<BattleLog, 'timestamp'>) {
    battle.logs.push({
      ...log,
      timestamp: Date.now(),
    });
  }

  async executeSkill(battleId: string, actorId: string, skillId: string, targetId: string): Promise<BattleState> {
    const battle = this.battles.get(battleId);
    if (!battle || battle.isOver) {
      throw new Error('战斗不存在或已结束');
    }

    if (battle.currentActorId !== actorId) {
      throw new Error('不是你的回合');
    }

    const actor = battle.actors.find(a => a.id === actorId);
    const target = battle.actors.find(a => a.id === targetId);
    if (!actor || !target) {
      throw new Error('角色不存在');
    }

    const skill = await this.skillsService.getSkill(skillId);
    if (!skill) {
      throw new Error('技能不存在');
    }

    const damage = this.calculateDamage(actor, target, skill);
    target.health = Math.max(0, target.health - damage);

    this.addLog(battle, {
      type: 'damage',
      actorId,
      targetId,
      skillId,
      value: damage,
      message: `${actor.name} 使用 ${skill.name} 对 ${target.name} 造成 ${damage} 点伤害`,
    });

    if (target.health <= 0) {
      this.addLog(battle, {
        type: 'death',
        actorId: targetId,
        message: `${target.name} 被击败了！`,
      });
      this.checkBattleEnd(battle);
    }

    if (!battle.isOver) {
      this.nextTurn(battle);
    }

    return battle;
  }

  private calculateDamage(actor: BattleActor, target: BattleActor, skill: any): number {
    const baseDamage = skill.damage?.base || 50;
    const scalingStat = skill.damage?.scaling?.stat || 'strength';
    const scalingMultiplier = skill.damage?.scaling?.multiplier || 0.5;
    
    const statValue = actor.stats[scalingStat] || 0;
    const totalDamage = baseDamage + statValue * scalingMultiplier;
    
    const armorReduction = Math.min(target.stats.armor / (target.stats.armor + 1000), 0.75);
    const finalDamage = Math.floor(totalDamage * (1 - armorReduction));
    
    return Math.max(1, finalDamage);
  }

  private nextTurn(battle: BattleState) {
    battle.turn += 1;
    const aliveActors = battle.actors.filter(a => a.health > 0);
    const currentIndex = aliveActors.findIndex(a => a.id === battle.currentActorId);
    const nextIndex = (currentIndex + 1) % aliveActors.length;
    battle.currentActorId = aliveActors[nextIndex].id;

    if (!aliveActors.find(a => a.id === battle.currentActorId)?.isPlayer) {
      setTimeout(() => this.executeAITurn(battle.id), 500);
    }
  }

  private async executeAITurn(battleId: string) {
    const battle = this.battles.get(battleId);
    if (!battle || battle.isOver) return;

    const actor = battle.actors.find(a => a.id === battle.currentActorId);
    const player = battle.actors.find(a => a.isPlayer);
    if (!actor || !player) return;

    const autoAttack = { id: 'auto_attack', name: '普通攻击', damage: { base: 30 } };
    const damage = this.calculateDamage(actor, player, autoAttack);
    player.health = Math.max(0, player.health - damage);

    this.addLog(battle, {
      type: 'damage',
      actorId: actor.id,
      targetId: player.id,
      skillId: 'auto_attack',
      value: damage,
      message: `${actor.name} 使用普通攻击对 ${player.name} 造成 ${damage} 点伤害`,
    });

    if (player.health <= 0) {
      this.addLog(battle, {
        type: 'death',
        actorId: player.id,
        message: `${player.name} 被击败了...`,
      });
      this.checkBattleEnd(battle);
    }

    if (!battle.isOver) {
      this.nextTurn(battle);
    }
  }

  private checkBattleEnd(battle: BattleState) {
    const alivePlayers = battle.actors.filter(a => a.isPlayer && a.health > 0);
    const aliveEnemies = battle.actors.filter(a => !a.isPlayer && a.health > 0);

    if (alivePlayers.length === 0) {
      battle.isOver = true;
      battle.winner = 'enemy';
      this.addLog(battle, {
        type: 'battle_end',
        actorId: 'system',
        message: '战斗失败...',
      });
    } else if (aliveEnemies.length === 0) {
      battle.isOver = true;
      battle.winner = 'player';
      battle.rewards = {
        experience: 500,
        gold: 50,
        items: [],
      };
      this.addLog(battle, {
        type: 'battle_end',
        actorId: 'system',
        message: '战斗胜利！获得 500 经验和 50 金币',
      });
    }
  }

  async getBattle(battleId: string): Promise<BattleState | null> {
    return this.battles.get(battleId) || null;
  }
}
'''
    
    # battle.controller.ts
    battle_controller = '''import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { BattleService } from './battle.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('battle')
export class BattleController {
  constructor(private battleService: BattleService) {}

  @UseGuards(JwtAuthGuard)
  @Post('start-pve')
  async startPVE(@Request() req, @Body() body: { characterId: string; dungeonId: string }) {
    return this.battleService.startPVEBattle(body.characterId, body.dungeonId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/execute')
  async executeSkill(
    @Param('id') battleId: string,
    @Body() body: { actorId: string; skillId: string; targetId: string },
  ) {
    return this.battleService.executeSkill(battleId, body.actorId, body.skillId, body.targetId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getBattle(@Param('id') battleId: string) {
    return this.battleService.getBattle(battleId);
  }
}
'''
    
    # 写入文件
    battle_dir = BACKEND_DIR / "src" / "battle"
    battle_dir.mkdir(parents=True, exist_ok=True)
    
    with open(battle_dir / "battle.module.ts", "w", encoding="utf-8") as f:
        f.write(battle_module)
    with open(battle_dir / "battle.service.ts", "w", encoding="utf-8") as f:
        f.write(battle_service)
    with open(battle_dir / "battle.controller.ts", "w", encoding="utf-8") as f:
        f.write(battle_controller)

def generate_backend_skills_module():
    """生成技能模块"""
    # skills.module.ts
    skills_module = '''import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';

@Module({
  providers: [SkillsService],
  controllers: [SkillsController],
  exports: [SkillsService],
})
export class SkillsModule {}
'''
    
    # skills.service.ts
    skills_service = '''import { Injectable } from '@nestjs/common';
import * as gameData from '../../../shared/game-data.json';

@Injectable()
export class SkillsService {
  async getSkillsByClass(classId: string): Promise<any[]> {
    return gameData.skills.skills.filter(s => s.class === classId);
  }

  async getSkill(skillId: string): Promise<any> {
    return gameData.skills.skills.find(s => s.id === skillId);
  }

  async getTalentsByClassAndSpec(classId: string, spec: string): Promise<any[]> {
    const classTalents = gameData.talents.talents[classId as keyof typeof gameData.talents.talents];
    if (!classTalents) return [];
    return classTalents[spec as keyof typeof classTalents] || [];
  }

  async getClasses(): Promise<any[]> {
    return gameData.classes.classes;
  }

  async getClass(classId: string): Promise<any> {
    return gameData.classes.classes.find(c => c.id === classId);
  }
}
'''
    
    # skills.controller.ts
    skills_controller = '''import { Controller, Get, Param } from '@nestjs/common';
import { SkillsService } from './skills.service';

@Controller('skills')
export class SkillsController {
  constructor(private skillsService: SkillsService) {}

  @Get('classes')
  async getClasses() {
    return this.skillsService.getClasses();
  }

  @