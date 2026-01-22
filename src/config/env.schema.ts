// src/config/env.schema.ts
import { z } from 'zod';

const toNumber = (v: unknown, defaultValue?: number) => {
  if (v === undefined || v === null || v === '') return defaultValue;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const toBoolean = (v: unknown, defaultValue?: boolean) => {
  if (v === undefined || v === null || v === '') return defaultValue;
  if (typeof v === 'boolean') return v;
  const s = String(v).toLowerCase().trim();
  if (['true', '1', 'yes', 'y', 'on'].includes(s)) return true;
  if (['false', '0', 'no', 'n', 'off'].includes(s)) return false;
  return undefined;
};

export const EnvSchema = z
  .object({
    // APP
    NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
    APP_PORT: z.preprocess((v) => toNumber(v, 2003), z.number().int().min(1).max(65535)),

    // POSTGRES (dùng cho container postgres khi chạy docker)
    POSTGRES_DB: z.string().min(1).optional(),
    POSTGRES_USER: z.string().min(1).optional(),
    POSTGRES_PASSWORD: z.string().min(1).optional(),

    // DB (app connect)
    DB_HOST: z.string().min(1),
    DB_PORT: z.preprocess((v) => toNumber(v, 5432), z.number().int().min(1).max(65535)),
    DB_NAME: z.string().min(1),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().min(1),

    // REDIS
    REDIS_HOST: z.string().min(1),
    REDIS_PORT: z.preprocess((v) => toNumber(v, 6379), z.number().int().min(1).max(65535)),

    // Optional: nếu bạn dùng 1 biến chung
    DATABASE_URL: z.string().url().optional(),

    // Optional: bạn có thể thêm flag debug/log
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).optional(),

    // Ví dụ boolean flag
    ENABLE_SWAGGER: z.preprocess((v) => toBoolean(v, false), z.boolean()).optional(),
  })
  .superRefine((env, ctx) => {
    // Nếu có DATABASE_URL thì không bắt buộc DB_* (tùy style)
    // Ở đây mình vẫn giữ DB_* bắt buộc, nhưng bạn có thể nới:
    // if (env.DATABASE_URL) return;

    // Nếu chạy production bằng docker-compose thì nên có POSTGRES_* cho postgres service
    // Nhưng local/prod dùng DB bên ngoài thì không cần.
    // => Không ép, chỉ optional.
  });

export type Env = z.infer<typeof EnvSchema>;
