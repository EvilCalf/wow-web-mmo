#!/usr/bin/env node
/**
 * WoW Web MMO - MVP 快速构建脚本
 */
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = __dirname;
const BACKEND_DIR = path.join(PROJECT_ROOT, 'backend', 'src');
const FRONTEND_DIR = path.join(PROJECT_ROOT, 'frontend', 'src');

// 游戏数据
const gameData = require('./shared/game-data.json');

function mkdirp(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// ====== 后端代码生成 ======

const BACKEND_FILES = {
  'app.module.ts': `import { Module } from '@nestjs/common';
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
`,

  'auth/auth.module.ts': `import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'wow-web-mmo-secret-key-2024',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
`,

  'auth/auth.service.ts': `import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    const existing = await this.usersService.findByEmail(userData.email);
    if (existing) {
      throw new UnauthorizedException('邮箱已被注册');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });
    return this.login(user);
  }
}
`,

  'auth/auth.controller.ts': `import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
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
`,

  'auth/local-auth.guard.ts': `import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
`,

  'auth/jwt-auth.guard.ts': `import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
`,

  'users/users.module.ts': `import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
`,

  'users/users.service.ts': `import { Injectable } from '@nestjs/common';

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
    const id = \`user_\${this.idCounter++}\`;
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
`,

  'users/users.controller.ts': `import { Controller, Get, UseGuards, Request } from '@nestjs/common';
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
`,

  'characters/characters.module.ts': `import { Module } from '@nestjs/common';
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
`,

  'characters/characters.service.ts': `import { Injectable } from '@nestjs/common';
const gameData = require('../../../shared/game-data.json');

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
    return gameData.classes.classes.find((c: any) => c.id === classId);
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
    const maxMana = stats.intellect * 15 + 50;
    
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

    const id = \`char_\${this.idCounter++}\`;
    const character: Character = {
      id,
      userId,
      name: characterData.name,
      class: characterData.class,
      spec: characterData.spec || classData.availableSpecs[0].id,
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
    return charIds.map((id: string) => this.characters.get(id)!).filter(Boolean);
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
    
    while (character.experience >= expNeeded && character.level < 80) {
      character.experience -= expNeeded;
      character.level += 1;
      
      const classData = this.getClassData(character.class);
      character.stats = this.calculateStats(classData, character.level);
      character.stats.health = character.stats.maxHealth;
      character.stats.mana = character.stats.maxMana;
    }

    return character;
  }
}
`,

  'characters/characters.controller.ts': `import { Controller, Get, Post, Put, Body, UseGuards, Request, Param } from '@nestjs/common';
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
`,

  'skills/skills.module.ts': `import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';

@Module({
  providers: [SkillsService],
  controllers: [SkillsController],
  exports: [SkillsService],
})
export class SkillsModule {}
`,

  'skills/skills.service.ts': `import { Injectable } from '@nestjs/common';
const gameData = require('../../../shared/game-data.json');

@Injectable()
export class SkillsService {
  async getSkillsByClass(classId: string): Promise<any[]> {
    return gameData.skills.skills.filter((s: any) => s.class === classId);
  }

  async getSkill(skillId: string): Promise<any> {
    return gameData.skills.skills.find((s: any) => s.id === skillId);
  }

  async getTalentsByClassAndSpec(classId: string, spec: string): Promise<any[]> {
    const classTalents = gameData.talents.talents[classId];
    if (!classTalents) return [];
    return classTalents[spec] || [];
  }

  async getClasses(): Promise<any[]> {
    return gameData.classes.classes;
  }

  async getClass(classId: string): Promise<any> {
    return gameData.classes.classes.find((c: any) => c.id === classId);
  }

  async getItems(): Promise<any[]> {
    return gameData.items.items;
  }
}
`,

  'skills/skills.controller.ts': `import { Controller, Get, Param } from '@nestjs/common';
import { SkillsService } from './skills.service';

@Controller('game-data')
export class SkillsController {
  constructor(private skillsService: SkillsService) {}

  @Get('classes')
  async getClasses() {
    return this.skillsService.getClasses();
  }

  @Get('classes/:id')
  async getClass(@Param('id') id: string) {
    return this.skillsService.getClass(id);
  }

  @Get('classes/:id/skills')
  async getSkillsByClass(@Param('id') id: string) {
    return this.skillsService.getSkillsByClass(id);
  }

  @Get('skills/:id')
  async getSkill(@Param('id') id: string) {
    return this.skillsService.getSkill(id);
  }

  @Get('items')
  async getItems() {
    return this.skillsService.getItems();
  }
}
`,

  'battle/battle.module.ts': `import { Module } from '@nestjs/common';
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
`,

  'battle/battle.service.ts': `import { Injectable } from '@nestjs/common';
import { CharactersService } from '../characters/characters.service';
import { SkillsService } from '../skills/skills.service';
const gameData = require('../../../shared/game-data.json');

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

const RAGE_NORMS = { warrior: true, death_knight: true };
const ENERGY_NORMS = { rogue: true, monk: true };
const FOCUS_NORMS = { hunter: true };

@Injectable()
export class BattleService {
  private battles: Map<string, BattleState> = new Map();
  private idCounter = 1;

  constructor(
    private charactersService: CharactersService,
    private skillsService: SkillsService,
  ) {}

  private createEnemy(dungeonId: string, enemyIndex: number, playerLevel: number): BattleActor {
    const dungeonEnemies = {
      ragefire_chasm: [
        { name: '怒焰穴居人', level: Math.max(1, playerLevel - 1), health: 150 + playerLevel * 30, class: 'warrior' },
        { name: '灼热的元素怪', level: Math.max(2, playerLevel), health: 200 + playerLevel * 40, class: 'shaman' },
        { name: '奥格弗林特', level: Math.max(4, playerLevel + 1), health: 350 + playerLevel * 50, class: 'warrior' },
        { name: '塔拉加曼', level: Math.max(6, playerLevel + 2), health: 500 + playerLevel * 80, class: 'shaman', isBoss: true },
      ]
    };
    
    const enemies = dungeonEnemies[dungeonId as keyof typeof dungeonEnemies] || dungeonEnemies.ragefire_chasm;
    const enemy = enemies[Math.min(enemyIndex, enemies.length - 1)];
    const level = enemy.level;
    
    return {
      id: \`enemy_\${enemyIndex}\`,
      type: 'enemy',
      name: enemy.name,
      class: enemy.class,
      level,
      health: enemy.health,
      maxHealth: enemy.health,
      resource: RAGE_NORMS[enemy.class as keyof typeof RAGE_NORMS] ? 0 : 100,
      maxResource: 100,
      resourceType: RAGE_NORMS[enemy.class as keyof typeof RAGE_NORMS] ? 'rage' : 'mana',
      stats: {
        strength: 20 + level * 8,
        agility: 15 + level * 5,
        stamina: 25 + level * 6,
        intellect: 10 + level * 4,
        spirit: 8 + level * 3,
        armor: 100 + level * 20,
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

    const isRage = RAGE_NORMS[character.class as keyof typeof RAGE_NORMS];
    const isEnergy = ENERGY_NORMS[character.class as keyof typeof ENERGY_NORMS];
    const isFocus = FOCUS_NORMS[character.class as keyof typeof FOCUS_NORMS];
    
    let resourceType = 'mana';
    let resource = character.stats.mana;
    let maxResource = character.stats.maxMana;
    
    if (isRage) {
      resourceType = 'rage';
      resource = 0;
      maxResource = 100;
    } else if (isEnergy) {
      resourceType = 'energy';
      resource = 100;
      maxResource = 100;
    } else if (isFocus) {
      resourceType = 'focus';
      resource = 50;
      maxResource = 100;
    }

    const playerActor: BattleActor = {
      id: 'player',
      type: 'player',
      name: character.name,
      class: character.class,
      level: character.level,
      health: character.stats.health,
      maxHealth: character.stats.maxHealth,
      resource,
      maxResource,
      resourceType,
      stats: { ...character.stats, armor: 50 + character.level * 10 },
      isPlayer: true,
      buffs: [],
      debuffs: [],
    };

    const enemies = [this.createEnemy(dungeonId, 0, character.level)];
    
    const battleId = \`battle_\${this.idCounter++}\`;
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
      message: \`战斗开始！\${playerActor.name} 遇到了 \${enemies.map(e => e.name).join('、')}\`,
    });

    this.battles.set(battleId, battle);
    
    if (!battle.actors.find(a => a.id === battle.currentActorId)?.isPlayer) {
      setTimeout(() => this.executeAITurn(battleId), 800);
    }
    
    return battle;
  }

  private getFirstActor(actors: BattleActor[]): string {
    return [...actors].sort((a, b) => (b.stats.agility || 10) - (a.stats.agility || 10))[0].id;
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

    let skill = await this.skillsService.getSkill(skillId);
    if (!skill && skillId === 'auto_attack') {
      skill = { id: 'auto_attack', name: '普通攻击', damage: { base: 20 + actor.level * 5, type: 'physical' } };
    }
    
    if (!skill) {
      throw new Error('技能不存在');
    }

    const damage = this.calculateDamage(actor, target, skill);
    target.health = Math.max(0, target.health - damage);

    if (actor.resourceType === 'rage' && actor.isPlayer) {
      actor.resource = Math.min(actor.maxResource, actor.resource + 10 + Math.floor(damage / 10));
    }

    this.addLog(battle, {
      type: 'damage',
      actorId,
      targetId,
      skillId,
      value: damage,
      message: \`\${actor.name} 使用 \${skill.name} 对 \${target.name} 造成 \${damage} 点伤害\`,
    });

    if (target.health <= 0) {
      this.addLog(battle, {
        type: 'death',
        actorId: targetId,
        message: \`\${target.name} 被击败了！\`,
      });
      this.checkBattleEnd(battle);
    }

    if (!battle.isOver) {
      this.nextTurn(battle);
    }

    return battle;
  }

  private calculateDamage(actor: BattleActor, target: BattleActor, skill: any): number {
    const baseDamage = skill.damage?.base || 30;
    const scalingStat = skill.damage?.scaling?.stat || (actor.class === 'mage' || actor.class === 'warlock' || actor.class === 'priest' ? 'intellect' : 'strength');
    const scalingMultiplier = skill.damage?.scaling?.multiplier || 0.5;
    
    const statValue = actor.stats[scalingStat] || 0;
    const totalDamage = baseDamage + statValue * scalingMultiplier;
    
    const armor = target.stats.armor || 0;
    const armorReduction = Math.min(armor / (armor + 1000), 0.75);
    const finalDamage = Math.floor(totalDamage * (1 - armorReduction));
    
    return Math.max(1, finalDamage);
  }

  private nextTurn(battle: BattleState) {
    battle.turn += 1;
    const aliveActors = battle.actors.filter(a => a.health > 0);
    const currentIndex = aliveActors.findIndex(a => a.id === battle.currentActorId);
    const nextIndex = (currentIndex + 1) % aliveActors.length;
    battle.currentActorId = aliveActors[nextIndex].id;

    const nextActor = aliveActors.find(a => a.id === battle.currentActorId);
    if (nextActor) {
      if (nextActor.resourceType === 'mana') {
        nextActor.resource = Math.min(nextActor.maxResource, nextActor.resource + Math.floor(nextActor.maxResource * 0.05));
      } else if (nextActor.resourceType === 'energy') {
        nextActor.resource = Math.min(nextActor.maxResource, nextActor.resource + 20);
      } else if (nextActor.resourceType === 'focus') {
        nextActor.resource = Math.min(nextActor.maxResource, nextActor.resource + 6);
      } else if (nextActor.resourceType === 'rage') {
        nextActor.resource = Math.max(0, nextActor.resource - 5);
      }
    }

    if (!nextActor?.isPlayer) {
      setTimeout(() => this.executeAITurn(battle.id), 600);
    }
  }

  private async executeAITurn(battleId: string) {
    const battle = this.battles.get(battleId);
    if (!battle || battle.isOver) return;

    const actor = battle.actors.find(a => a.id === battle.currentActorId);
    const player = battle.actors.find(a => a.isPlayer && a.health > 0);
    if (!actor || !player) return;

    const autoAttack = { id: 'auto_attack', name: '普通攻击', damage: { base: 25 + actor.level * 5 } };
    const damage = this.calculateDamage(actor, player, autoAttack);
    player.health = Math.max(0, player.health - damage);

    this.addLog(battle, {
      type: 'damage',
      actorId: actor.id,
      targetId: player.id,
      skillId: 'auto_attack',
      value: damage,
      message: \`\${actor.name} 使用普通攻击对 \${player.name} 造成 \${damage} 点伤害\`,
    });

    if (player.health <= 0) {
      this.addLog(battle, {
        type: 'death',
        actorId: player.id,
        message: \`\${player.name} 被击败了...\`,
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
        experience: 300 + alivePlayers[0].level * 100,
        gold: 20 + alivePlayers[0].level * 5,
        items: [],
      };
      this.addLog(battle, {
        type: 'battle_end',
        actorId: 'system',
        message: \`战斗胜利！获得 \${battle.rewards.experience} 经验和 \${battle.rewards.gold} 金币\`,
      });
    }
  }

  async claimRewards(battleId: string, characterId: string): Promise<any> {
    const battle = this.battles.get(battleId);
    if (!battle || !battle.isOver || battle.winner !== 'player' || !battle.rewards) {
      throw new Error('无法领取奖励');
    }

    const character = await this.charactersService.addExperience(characterId, battle.rewards.experience);
    return { character, rewards: battle.rewards };
  }

  async getBattle(battleId: string): Promise<BattleState | null> {
    return this.battles.get(battleId) || null;
  }
}
`,

  'battle/battle.controller.ts': `import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
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
  @Post(':id/claim-rewards')
  async claimRewards(
    @Param('id') battleId: string,
    @Body() body: { characterId: string },
  ) {
    return this.battleService.claimRewards(battleId, body.characterId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getBattle(@Param('id') battleId: string) {
    return this.battleService.getBattle(battleId);
  }
}
`,

  'dungeons/dungeons.module.ts': `import { Module } from '@nestjs/common';
import { DungeonsService } from './dungeons.service';
import { DungeonsController } from './dungeons.controller';

@Module({
  providers: [DungeonsService],
  controllers: [DungeonsController],
  exports: [DungeonsService],
})
export class DungeonsModule {}
`,

  'dungeons/dungeons.service.ts': `import { Injectable } from '@nestjs/common';

interface Dungeon {
  id: string;
  name: string;
  nameEn: string;
  minLevel: number;
  maxLevel: number;
  description: string;
  bosses: string[];
  location: string;
}

@Injectable()
export class DungeonsService {
  private dungeons: Dungeon[] = [
    {
      id: 'ragefire_chasm',
      name: '怒焰裂谷',
      nameEn: 'Ragefire Chasm',
      minLevel: 1,
      maxLevel: 10,
      description: '位于奥格瑞玛地下的怒焰裂谷是一个充满熔岩和元素生物的危险区域。',
      bosses: ['奥格弗林特', '塔拉加曼'],
      location: '奥格瑞玛',
    },
  ];

  async getDungeons(): Promise<Dungeon[]> {
    return this.dungeons;
  }

  async getDungeon(id: string): Promise<Dungeon | undefined> {
    return this.dungeons.find(d => d.id === id);
  }
}
`,

  'dungeons/dungeons.controller.ts': `import { Controller, Get, Param } from '@