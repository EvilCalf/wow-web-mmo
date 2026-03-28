import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Character } from '../characters/character.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 1 })
  level: number;

  @Column({ default: 0 })
  experience: number;

  @Column({ default: 100 })
  health: number;

  @Column({ default: 50 })
  mana: number;

  @Column({ default: 'player' })
  role: string;

  @OneToMany(() => Character, (character) => character.user)
  characters: Character[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
