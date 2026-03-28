import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CharactersModule } from './characters/characters.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'wow.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 开发环境使用，生产环境请关闭
    }),
    AuthModule,
    UsersModule,
    CharactersModule,
  ],
})
export class AppModule {}
