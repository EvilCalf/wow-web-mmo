import { Injectable } from '@nestjs/common';
import { Character, CharacterStats } from './character.entity';

const classData = [
  { id: 'warrior', name: '战士', stats: { strength: 90, agility: 50, stamina: 100, intellect: 30, spirit: 40 } },
  { id: 'paladin', name: '圣骑士', stats: { strength: 70, agility: 40, stamina: 85, intellect: 60, spirit: 70 } },
  { id: 'hunter', name: '猎人', stats: { strength: 40, agility: 95, stamina: 75, intellect: 45, spirit: 50 } },
  { id: 'rogue', name: '潜行者', stats: { strength: 50, agility: 100, stamina: 70, intellect: 25, spirit: 35 } },
  { id: 'priest', name: '牧师', stats: { strength: 30, agility: 40, stamina: 65, intellect: 100, spirit: 90 } },
  { id: 'death_knight', name: '死亡骑士', stats: { strength: 85, agility: 55, stamina: 95, intellect: 40, spirit: 30 } },
  { id: 'shaman', name: '萨满祭司', stats: { strength: 60, agility: 50, stamina: 75, intellect: 85, spirit: 70 } },
  { id: 'mage', name: '法师', stats: { strength: 25, agility: 35, stamina: 60, intellect: 105, spirit: 65 } },
  { id: 'warlock', name: '术士', stats: { strength: 30, agility: 35, stamina: 65, intellect: 100, spirit: 60 } },
  { id: 'monk', name: '武僧', stats: { strength: 65, agility: 85, stamina: 80, intellect: 50, spirit: 60 } },
];

@Injectable()
export class CharactersService {
  private characters: Map<string, Character> = new Map();
  private userCharacters: Map<string, string[]> = new Map();
  private idCounter = 1;

  private getClassData(classId: string) {
    return classData.find(c => c.id === classId);
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
    const cls = this.getClassData(characterData.class);
    if (!cls) {
      throw new Error('职业不存在');
    }

    const id = `char_${this.idCounter++}`;
    const character: Character = {
      id,
      userId,
      name: characterData.name,
      class: characterData.class,
      spec: characterData.spec || 'primary',
      faction: characterData.faction,
      level: 1,
      experience: 0,
      stats: this.calculateStats(cls, 1),
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
    
    while (character.experience >= expNeeded && character.level < 80) {
      character.experience -= expNeeded;
      character.level += 1;
      
      const cls = this.getClassData(character.class);
      if (cls) {
        character.stats = this.calculateStats(cls, character.level);
      }
    }

    return character;
  }
}
