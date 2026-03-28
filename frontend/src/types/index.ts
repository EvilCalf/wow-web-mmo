export interface User {
  id: string
  username: string
  email: string
  level: number
  experience: number
  avatar?: string
}

export interface Character {
  id: string
  name: string
  class: string
  race: string
  level: number
  health: number
  maxHealth: number
  mana: number
  maxMana: number
  position: {
    x: number
    y: number
    map: string
  }
  equipment: Equipment[]
  inventory: Item[]
  spells: Spell[]
}

export interface Item {
  id: string
  name: string
  description: string
  type: 'weapon' | 'armor' | 'consumable' | 'quest'
  stats?: {
    attack?: number
    defense?: number
    health?: number
    mana?: number
  }
  icon: string
  level: number
}

export interface Equipment extends Item {
  slot: 'head' | 'chest' | 'legs' | 'feet' | 'hands' | 'weapon' | 'offhand' | 'neck' | 'ring1' | 'ring2'
}

export interface Spell {
  id: string
  name: string
  description: string
  manaCost: number
  damage?: number
  healing?: number
  cooldown: number
  range: number
  icon: string
}

export interface GameState {
  currentUser: User | null
  currentCharacter: Character | null
  isLoggedIn: boolean
  isInGame: boolean
  loading: boolean
  error: string | null
}

export interface AuthState {
  token: string | null
  user: User | null
  loading: boolean
  error: string | null
}
