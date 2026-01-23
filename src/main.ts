import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
 // Load env theo môi trường: .env.development / .env.production ...
  dotenv.config({
    path: `.env.${process.env.NODE_ENV || 'development'}`,
  });
import { AppModule } from './app.module';
import { env } from './config/env';

import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './interceptor/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['log', 'error', 'warn', 'debug', 'verbose'], // bật nếu cần
  });

  app.useGlobalInterceptors(new LoggingInterceptor());

  // Cho phép tắt app graceful (SIGINT/SIGTERM) - hợp Docker/k8s
  app.enableShutdownHooks();

  // Prefix cho toàn bộ API (tuỳ bạn, nếu không muốn thì xoá)
  const GLOBAL_PREFIX = 'api';
  app.setGlobalPrefix(GLOBAL_PREFIX);

  // CORS (tuỳ chỉnh theo env)
  app.enableCors({
    origin: '*', // true = allow all; hoặc set domain
    credentials: true,
  });

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // bỏ field dư
      forbidNonWhitelisted: true, // gặp field dư -> throw
      transform: true, // auto transform type theo DTO
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger (bật ở non-prod hoặc tuỳ flag)
  const enableSwagger =
    process.env.NODE_ENV !== 'production'; // nếu muốn prod vẫn bật -> bỏ điều kiện này

  if (enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle('Warehouse API')
      .setDescription('API documentation')
      .setVersion('1.0.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  const port = Number(env.APP_PORT ?? 3000);
  await app.listen(port, '0.0.0.0');

  const url = await app.getUrl();
  // eslint-disable-next-line no-console
  console.log(`🚀 Server running at: ${url}/${GLOBAL_PREFIX}`);
  if (enableSwagger) {
    // eslint-disable-next-line no-console
    console.log(`📚 Swagger: ${url}/'docs'}`);
  }
}

bootstrap();
