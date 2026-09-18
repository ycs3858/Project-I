import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 다른 출처의 프론트엔드 요청을 허용하는 코드
  app.enableCors();
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
