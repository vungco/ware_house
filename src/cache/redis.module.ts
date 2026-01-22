import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { env } from 'src/config/env';
import { RedisCacheService } from './redis.service';
import { REDIS_CLIENT } from './redis.const';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: () => {
        return new Redis({
          host: env.REDIS_HOST,
          port: env.REDIS_PORT,
          lazyConnect: true,
          maxRetriesPerRequest: 3,
        });
      },
    },
    RedisCacheService,
  ],
  exports: [REDIS_CLIENT, RedisCacheService],
})
export class RedisModule {}
