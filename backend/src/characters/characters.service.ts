import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character, CharacterClass, CharacterRace, Faction } from './character.entity';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private charactersRepository: Repository<Character>,
  ) {}

  async findAll(userId?: number): Promise<Character[]> {
    const where = userId ? { userId, isActive: true } : { isActive: true };
    return this.charactersRepository.find({ where, relations: ['user'] });
  }

  async findOne(id: number): Promise<Character | null> {
    return this.charactersRepository.findOne({ where: { id }, relations: ['user'] });
  }

  async findByUserId(userId: number): Promise<Character[]> {
    return this.charactersRepository.find({ where: { userId, isActive: true } });
  }

  async create(character: Partial<Character>): Promise<Character> {
    // 检查角色名是否已存在
    const existingCharacter = await this.charactersRepository.findOne({ where: { name: character.name } });
    if (existingCharacter) {
      throw new NotFoundException('Character name already exists');
    }

    // 根据种族设置阵营
    const allianceRaces = [CharacterRace.HUMAN, CharacterRace.DWARF, CharacterRace.NIGHT_ELF, CharacterRace.GNOME, CharacterRace.DRAENEI];
    const hordeRaces = [CharacterRace.ORC, CharacterRace.UNDEAD, CharacterRace.TAUREN, CharacterRace.TROLL, CharacterRace.BLOOD_ELF];
    
    if (allianceRaces.includes(character.race)) {
      character.faction = Faction.ALLIANCE;
    } else if (hordeRaces.includes(character.race)) {
      character.faction = Faction.HORDE;
    }

    // 根据职业设置基础属性
    this.setBaseStats(character);

    const newCharacter = this.charactersRepository.create(character);
    return this.charactersRepository.save(newCharacter);
  }

  private setBaseStats(character: Partial<Character>) {
    switch (character.class) {
      case CharacterClass.WARRIOR:
        character.strength = 15;
        character.agility = 10;
        character.intellect = 5;
        character.stamina = 15;
        character.spirit = 5;
        character.maxHealth = 150;
        character.health = 150;
        character.maxMana = 0;
        character.mana = 0;
        break;
      case CharacterClass.MAGE:
        character.strength = 5;
        character.agility = 8;
        character.intellect = 20;
        character.stamina = 8;
        character.spirit = 15;
        character.maxHealth = 80;
        character.health = 80;
        character.maxMana = 150;
        character.mana = 150;
        break;
      case CharacterClass.HUNTER:
        character.strength = 10;
        character.agility = 18;
        character.intellect = 8;
        character.stamina = 12;
        character.spirit = 7;
        character.maxHealth = 120;
        character.health = 120;
        character.maxMana = 80;
        character.mana = 80;
        break;
      case CharacterClass.PRIEST:
        character.strength = 5;
        character.agility = 7;
        character.intellect = 18;
        character.stamina = 8;
        character.spirit = 17;
        character.maxHealth = 80;
        character.health = 80;
        character.maxMana = 140;
        character.mana = 140;
        break;
      case CharacterClass.ROGUE:
        character.strength = 10;
        character.agility = 20;
        character.intellect = 5;
        character.stamina = 12;
        character.spirit = 6;
        character.maxHealth = 120;
        character.health = 120;
        character.maxMana = 0;
        character.mana = 0;
        break;
      case CharacterClass.SHAMAN:
        character.strength = 12;
        character.agility = 8;
        character.intellect = 15;
        character.stamina = 12;
        character.spirit = 10;
        character.maxHealth = 120;
        character.health = 120;
        character.maxMana = 120;
        character.mana = 120;
        break;
      case CharacterClass.PALADIN:
        character.strength = 14;
        character.agility = 8;
        character.intellect = 10;
        character.stamina = 14;
        character.spirit = 8;
        character.maxHealth = 140;
        character.health = 140;
        character.maxMana = 80;
        character.mana = 80;
        break;
      case CharacterClass.WARLOCK:
        character.strength = 5;
        character.agility = 7;
        character.intellect = 19;
        character.stamina = 9;
        character.spirit = 15;
        character.maxHealth = 90;
        character.health = 90;
        character.maxMana = 140;
        character.mana = 140;
        break;
      case CharacterClass.DRUID:
        character.strength = 10;
        character.agility = 10;
        character.intellect = 15;
        character.stamina = 10;
        character.spirit = 15;
        character.maxHealth = 100;
        character.health = 100;
        character.maxMana = 120;
        character.mana = 120;
        break;
      default:
        break;
    }
  }

  async update(id: number, character: Partial<Character>): Promise<Character | null> {
    await this.charactersRepository.update(id, character);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.charactersRepository.update(id, { isActive: false });
  }

  async addExperience(id: number, experience: number): Promise<Character | null> {
    const character = await this.findOne(id);
    if (!character) {
      throw new NotFoundException('Character not found');
    }

    character.experience += experience;
    const requiredExperience = character.level * 1000;
    
    // 升级逻辑
    while (character.experience >= requiredExperience) {
      character.experience -= requiredExperience;
      character.level += 1;
      this.levelUpStats(character);
    }

    return this.update(id, character);
  }

  private levelUpStats(character: Character) {
    switch (character.class) {
      case CharacterClass.WARRIOR:
        character.strength += 3;
        character.stamina += 3;
        character.maxHealth += 30;
        break;
      case CharacterClass.MAGE:
        character.intellect += 4;
        character.stamina += 2;
        character.maxHealth += 15;
        character.maxMana += 25;
        break;
      case CharacterClass.HUNTER:
        character.agility += 3;
        character.stamina += 2;
        character.intellect += 2;
        character.maxHealth += 25;
        character.maxMana += 15;
        break;
      default:
        character.strength += 2;
        character.agility += 2;
        character.intellect += 2;
        character.stamina += 2;
        character.spirit += 2;
        character.maxHealth += 20;
        character.maxMana += 20;
        break;
    }
    character.health = character.maxHealth;
    character.mana = character.maxMana;
  }
}
