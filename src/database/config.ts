import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { env } from 'src/config/env';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,

      // ✅ để entity ở các feature module tự load
      autoLoadEntities: true,

      // ❌ production không bật synchronize
      synchronize: true,

      // log SQL ở dev
      // logging: env.NODE_ENV === 'dev',

      // (tuỳ chọn) cấu hình pool cho production
      extra: {
        max: 10, // max connections
      },
    };
  }
}
