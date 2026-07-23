import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log(
    'PORTONE_API_SECRET 길이 =',
    process.env.PORTONE_API_SECRET?.length,
  );

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://trip-pilot-ai-web.vercel.app',
      'https://trip-pilot-ai-web-xp2a.vercel.app',
      'https://trip-pilot-ai-web2-git-main-tjdwo36447-pixels-projects.vercel.app'
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');
}

bootstrap();