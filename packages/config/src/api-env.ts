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
    MONGODB_URI: z
      .string()
      .regex(/^mongodb(\+srv)?:\/\//, 'must be a mongodb:// or mongodb+srv:// connection string'),
    // FareRide always uses its own database, whatever database the URI names (ADR 0009).
    MONGODB_DB_NAME: z
      .string()
      .regex(/^[A-Za-z0-9_-]{1,63}$/, 'must be a plain database name')
      .default('fareride'),
    REDIS_URL: z.url().refine((url) => url.startsWith('redis'), 'must be a redis:// URL'),
    CORS_ORIGINS: commaSeparatedUrls,
    READINESS_TIMEOUT_MS: z.coerce.number().int().positive().default(2_000),
  })
  .extend(regionalEnvSchema.shape);

export type ApiEnv = z.infer<typeof apiEnvSchema>;
