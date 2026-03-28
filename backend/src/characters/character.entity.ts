export interface CharacterStats {
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
