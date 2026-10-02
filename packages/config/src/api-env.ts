import { z } from 'zod';

import { regionalEnvSchema } from './regional.js';

const commaSeparatedUrls = z
  .string()
  .default('')
  .transform((value) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0),
  )
  .pipe(z.array(z.url()));

/** Environment for apps/api. Documented in .env.example. */
export const apiEnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    API_HOST: z.string().default('0.0.0.0'),
    API_PORT: z.coerce.number().int().min(1).max(65_535).default(4000),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
    DATABASE_URL: z.url().refine((url) => url.startsWith('postgres'), 'must be a postgres:// URL'),
    REDIS_URL: z.url().refine((url) => url.startsWith('redis'), 'must be a redis:// URL'),
    CORS_ORIGINS: commaSeparatedUrls,
    READINESS_TIMEOUT_MS: z.coerce.number().int().positive().default(2_000),
  })
  .extend(regionalEnvSchema.shape);

export type ApiEnv = z.infer<typeof apiEnvSchema>;
