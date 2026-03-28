import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

export enum CharacterClass {
  WARRIOR = 'warrior',
  MAGE = 'mage',
  HUNTER = 'hunter',
  PRIEST = 'priest',
  ROGUE = 'rogue',
  SHAMAN = 'shaman',
  PALADIN = 'paladin',
  WARLOCK = 'warlock',
  DRUID = 'druid',
}

export enum CharacterRace {
  HUMAN = 'human',
  ORC = 'orc',
  DWARF = 'dwarf',
  NIGHT_ELF = 'night_elf',
  UNDEAD = 'undead',
  TAUREN = 'tauren',
  GNOME = 'gnome',
  TROLL = 'troll',
  BLOOD_ELF = 'blood_elf',
  DRAENEI = 'draenei',
}

export enum Faction {
  ALLIANCE = 'alliance',
  HORDE = 'horde',
}

@Entity()
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({
    type: 'simple-enum',
    enum: CharacterClass,
  })
  class: CharacterClass;

  @Column({
    type: 'simple-enum',
    enum: CharacterRace,
  })
  race: CharacterRace;

  @Column({
    type: 'simple-enum',
    enum: Faction,
  })
  faction: Faction;

  @Column({ default: 1 })
  level: number;

  @Column({ default: 0 })
  experience: number;

  @Column({ default: 100 })
  health: number;

  @Column({ default: 100 })
  maxHealth: number;

  @Column({ default: 50 })
  mana: number;

  @Column({ default: 50 })
  maxMana: number;

  @Column({ default: 10 })
  strength: number;

  @Column({ default: 10 })
  agility: number;

  @Column({ default: 10 })
  intellect: number;

  @Column({ default: 10 })
  stamina: number;

  @Column({ default: 10 })
  spirit: number;

  @Column({ default: 0 })
  gold: number;

  @Column({ type: 'json', default: () => "'[]'" })
  inventory: any[];

  @Column({ type: 'json', default: () => "'[]'" })
  skills: any[];

  @Column({ default: 'Elwynn Forest' })
  location: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.characters)
  user: User;

  @Column()
  userId: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
