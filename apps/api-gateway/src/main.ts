import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();

  const port = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['https://studio.apollographql.com', `http://localhost:${port}`],
    credentials: true,
  });

  await app.listen(port);
}
bootstrap();
