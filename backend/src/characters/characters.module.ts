import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Character } from './character.entity';
import { CharactersService } from './characters.service';
import { CharactersController } from './characters.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Character]),
    JwtModule.register({
      secret: 'wow-web-mmo-secret-key-2026', // 生产环境请替换为环境变量
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [CharactersService],
  controllers: [CharactersController],
  exports: [CharactersService],
})
export class CharactersModule {}
