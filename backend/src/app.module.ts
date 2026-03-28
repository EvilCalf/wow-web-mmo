import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CharactersModule } from './characters/characters.module';
import { GameDataController } from './game-data.controller';
import { BattleController } from './battle.controller';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(__dirname, '../data/wow.db'),
      entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
      synchronize: true, // 开发环境使用，生产环境关闭
      logging: false,
    }),
    AuthModule,
    UsersModule,
    CharactersModule,
  ],
  controllers: [GameDataController, BattleController],
})
export class AppModule {}
