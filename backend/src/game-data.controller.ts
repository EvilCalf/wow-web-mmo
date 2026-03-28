import { Controller, Get, Param } from '@nestjs/common';

const classData = [
  { id: 'warrior', name: '战士', nameEn: 'Warrior', color: '#C79C6E', description: '战士是近身格斗专家。', stats: { strength: 90, agility: 50, stamina: 100, intellect: 30, spirit: 40 }, availableSpecs: [{ id: 'arms', name: '武器', role: 'melee' }, { id: 'fury', name: '狂怒', role: 'melee' }, { id: 'protection', name: '防护', role: 'tank' }] },
  { id: 'paladin', name: '圣骑士', nameEn: 'Paladin', color: '#F58CBA', description: '圣骑士是圣光的战士。', stats: { strength: 70, agility: 40, stamina: 85, intellect: 60, spirit: 70 }, availableSpecs: [{ id: 'holy', name: '神圣', role: 'healer' }, { id: 'protection', name: '防护', role: 'tank' }, { id: 'retribution', name: '惩戒', role: 'melee' }] },
  { id: 'hunter', name: '猎人', nameEn: 'Hunter', color: '#ABD473', description: '猎人是远程物理输出。', stats: { strength: 40, agility: 95, stamina: 75, intellect: 45, spirit: 50 }, availableSpecs: [{ id: 'beast_mastery', name: '野兽控制', role: 'ranged' }, { id: 'marksmanship', name: '射击', role: 'ranged' }, { id: 'survival', name: '生存', role: 'melee' }] },
  { id: 'rogue', name: '潜行者', nameEn: 'Rogue', color: '#FFF569', description: '潜行者是潜行专家。', stats: { strength: 50, agility: 100, stamina: 70, intellect: 25, spirit: 35 }, availableSpecs: [{ id: 'assassination', name: '奇袭', role: 'melee' }, { id: 'outlaw', name: '狂徒', role: 'melee' }, { id: 'subtlety', name: '敏锐', role: 'melee' }] },
  { id: 'priest', name: '牧师', nameEn: 'Priest', color: '#FFFFFF', description: '牧师是神圣魔法的使用者。', stats: { strength: 30, agility: 40, stamina: 65, intellect: 100, spirit: 90 }, availableSpecs: [{ id: 'discipline', name: '戒律', role: 'healer' }, { id: 'holy', name: '神圣', role: 'healer' }, { id: 'shadow', name: '暗影', role: 'ranged' }] },
  { id: 'mage', name: '法师', nameEn: 'Mage', color: '#69CCF0', description: '法师是奥术魔法大师。', stats: { strength: 25, agility: 35, stamina: 60, intellect: 105, spirit: 65 }, availableSpecs: [{ id: 'arcane', name: '奥术', role: 'ranged' }, { id: 'fire', name: '火焰', role: 'ranged' }, { id: 'frost', name: '冰霜', role: 'ranged' }] },
];

const dungeonsData = [
  { id: 'ragefire_chasm', name: '怒焰裂谷', nameEn: 'Ragefire Chasm', minLevel: 1, maxLevel: 10, description: '位于奥格瑞玛地下的怒焰裂谷。', location: '奥格瑞玛', bosses: ['奥格弗林特', '塔拉加曼'] },
];

@Controller('game-data')
export class GameDataController {
  @Get('classes')
  getClasses() {
    return classData;
  }

  @Get('classes/:id')
  getClass(@Param('id') id: string) {
    return classData.find(c => c.id === id);
  }

  @Get('dungeons')
  getDungeons() {
    return dungeonsData;
  }

  @Get('dungeons/:id')
  getDungeon(@Param('id') id: string) {
    return dungeonsData.find(d => d.id === id);
  }
}
