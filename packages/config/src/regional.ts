import { z } from 'zod';

/**
 * Country-specific defaults (ADR 0008). The launch market is not decided yet,
 * so these are configuration with development fallbacks, never constants in business code.
 */
export const regionalEnvSchema = z.object({
  DEFAULT_CURRENCY: z
    .string()
    .regex(/^[A-Z]{3}$/, 'must be an ISO 4217 code such as USD')
    .default('USD'),
  DEFAULT_PHONE_REGION: z
    .string()
    .regex(/^[A-Z]{2}$/, 'must be an ISO 3166-1 alpha-2 code such as US')
    .default('US'),
  DEFAULT_LOCALE: z.string().min(2).default('en'),
  DEFAULT_TIME_ZONE: z
    .string()
    .refine(isValidTimeZone, 'must be an IANA time zone such as UTC')
    .default('UTC'),
});

export type RegionalConfig = z.infer<typeof regionalEnvSchema>;

function isValidTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat('en', { timeZone: value });
    return true;
  } catch {
    return false;
  }
}
