import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});
import { AppModule } from './app.module';
import { env } from './config/env';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(env.APP_PORT ?? 3000);
}
bootstrap();
