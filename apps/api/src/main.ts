import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

 

console.log(
  'PORTONE_API_SECRET 길이 =',
  process.env.PORTONE_API_SECRET?.length,
);

  const app = await NestFactory.create(AppModule);

  // Next.js 프론트(localhost:3000) 접근 허용
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();