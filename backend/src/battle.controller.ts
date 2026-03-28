import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

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

@Controller('battle')
export class BattleController {
  private battles: Map<string, BattleState> = new Map();
  private idCounter = 1;

  @UseGuards(JwtAuthGuard)
  @Post('start-pve')
  startPVE(@Body() body: { characterId: string; dungeonId: string }) {
    const battleId = `battle_${this.idCounter++}`;
    
    const player: BattleActor = {
      id: 'player',
      type: 'player',
      name: '玩家角色',
      class: 'warrior',
      level: 1,
      health: 200,
      maxHealth: 200,
      resource: 0,
      maxResource: 100,
      resourceType: 'rage',
      stats: { strength: 90, agility: 50, stamina: 100, intellect: 30, spirit: 40, armor: 150 },
      isPlayer: true,
    };

    const enemy: BattleActor = {
      id: 'enemy_1',
      type: 'enemy',
      name: '怒焰穴居人',
      class: 'warrior',
      level: 2,
      health: 150,
      maxHealth: 150,
      resource: 0,
      maxResource: 100,
      resourceType: 'rage',
      stats: { strength: 36, agility: 26, stamina: 44, intellect: 18, spirit: 16, armor: 140 },
    };

    const battle: BattleState = {
      id: battleId,
      actors: [player, enemy],
      turn: 1,
      currentActorId: 'player',
      logs: [{
        type: 'battle_start',
        actorId: 'system',
        message: '战斗开始！玩家角色 遇到了 怒焰穴居人',
        timestamp: Date.now(),
      }],
      isOver: false,
    };

    this.battles.set(battleId, battle);
    return battle;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/execute')
  executeSkill(
    @Param('id') battleId: string,
    @Body() body: { actorId: string; skillId: string; targetId: string },
  ) {
    const battle = this.battles.get(battleId);
    if (!battle || battle.isOver) {
      throw new Error('战斗不存在或已结束');
    }

    const actor = battle.actors.find(a => a.id === body.actorId);
    const target = battle.actors.find(a => a.id === body.targetId);
    if (!actor || !target) {
      throw new Error('角色不存在');
    }

    const damage = 20 + actor.level * 5 + Math.floor(actor.stats.strength * 0.5);
    target.health = Math.max(0, target.health - damage);

    battle.logs.push({
      type: 'damage',
      actorId: body.actorId,
      targetId: body.targetId,
      skillId: body.skillId,
      value: damage,
      message: `${actor.name} 使用 普通攻击 对 ${target.name} 造成 ${damage} 点伤害`,
      timestamp: Date.now(),
    });

    if (target.health <= 0) {
      battle.logs.push({
        type: 'death',
        actorId: target.id,
        message: `${target.name} 被击败了！`,
        timestamp: Date.now(),
      });
      battle.isOver = true;
      battle.winner = 'player';
      battle.rewards = { experience: 300, gold: 20, items: [] };
      battle.logs.push({
        type: 'battle_end',
        actorId: 'system',
        message: `战斗胜利！获得 ${battle.rewards.experience} 经验和 ${battle.rewards.gold} 金币`,
        timestamp: Date.now(),
      });
    } else {
      // 敌人回合
      battle.turn += 1;
      battle.currentActorId = target.id;
      
      setTimeout(() => {
        const currentBattle = this.battles.get(battleId);
        if (!currentBattle || currentBattle.isOver) return;

        const enemyActor = currentBattle.actors.find(a => a.id === target.id);
        const playerTarget = currentBattle.actors.find(a => a.isPlayer);
        if (!enemyActor || !playerTarget) return;

        const enemyDamage = 15 + enemyActor.level * 4;
        playerTarget.health = Math.max(0, playerTarget.health - enemyDamage);

        currentBattle.logs.push({
          type: 'damage',
          actorId: enemyActor.id,
          targetId: playerTarget.id,
          skillId: 'auto_attack',
          value: enemyDamage,
          message: `${enemyActor.name} 使用普通攻击对 ${playerTarget.name} 造成 ${enemyDamage} 点伤害`,
          timestamp: Date.now(),
        });

        if (playerTarget.health <= 0) {
          currentBattle.logs.push({
            type: 'death',
            actorId: playerTarget.id,
            message: `${playerTarget.name} 被击败了...`,
            timestamp: Date.now(),
          });
          currentBattle.isOver = true;
          currentBattle.winner = 'enemy';
          currentBattle.logs.push({
            type: 'battle_end',
            actorId: 'system',
            message: '战斗失败...',
            timestamp: Date.now(),
          });
        } else {
          currentBattle.turn += 1;
          currentBattle.currentActorId = playerTarget.id;
        }
      }, 1000);
    }

    return battle;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/claim-rewards')
  claimRewards(@Param('id') battleId: string, @Body() body: { characterId: string }) {
    const battle = this.battles.get(battleId);
    if (!battle || !battle.isOver || battle.winner !== 'player') {
      throw new Error('无法领取奖励');
    }
    return { character: { id: body.characterId, level: 1, experience: battle.rewards?.experience || 0 }, rewards: battle.rewards };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getBattle(@Param('id') battleId: string) {
    return this.battles.get(battleId);
  }
}
