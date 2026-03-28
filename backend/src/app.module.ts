import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CharactersModule } from './characters/characters.module';
import { GameDataController } from './game-data.controller';
import { BattleController } from './battle.controller';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CharactersModule,
  ],
  controllers: [GameDataController, BattleController],
})
export class AppModule {}
