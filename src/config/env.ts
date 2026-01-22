// src/config/env.ts
import { EnvSchema, type Env } from './env.schema';

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  // In lỗi rõ ràng để biết env nào sai
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env: Env = Object.freeze(parsed.data);
