import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 全局路由前缀
  app.setGlobalPrefix('api');
  
  // 允许跨域
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3001);
  console.log('WoW Web MMO Backend running on http://localhost:3001/api');
}
bootstrap();
