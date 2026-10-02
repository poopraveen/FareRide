import { describe, expect, it } from 'vitest';

import { apiEnvSchema } from './api-env.js';
import { EnvValidationError, parseEnv } from './parse-env.js';

const required = {
  DATABASE_URL: 'postgresql://fareride:fareride@localhost:5432/fareride',
  REDIS_URL: 'redis://localhost:6379',
};

describe('apiEnvSchema', () => {
  it('applies development defaults, including regional ones', () => {
    const env = parseEnv(apiEnvSchema, required);

    expect(env).toMatchObject({
      NODE_ENV: 'development',
      API_PORT: 4000,
      CORS_ORIGINS: [],
      DEFAULT_CURRENCY: 'USD',
      DEFAULT_PHONE_REGION: 'US',
      DEFAULT_TIME_ZONE: 'UTC',
    });
  });

  it('splits and validates CORS origins', () => {
    const env = parseEnv(apiEnvSchema, {
      ...required,
      CORS_ORIGINS: 'http://localhost:3000, http://localhost:3001',
    });

    expect(env.CORS_ORIGINS).toEqual(['http://localhost:3000', 'http://localhost:3001']);
  });

  it('reports every invalid variable without echoing values', () => {
    const attempt = () =>
      parseEnv(apiEnvSchema, {
        DATABASE_URL: 'mysql://secret-password@host/db',
        REDIS_URL: 'redis://localhost:6379',
        API_PORT: '70000',
        DEFAULT_CURRENCY: 'usd',
        DEFAULT_TIME_ZONE: 'Mars/Olympus',
      });

    expect(attempt).toThrow(EnvValidationError);
    try {
      attempt();
    } catch (error) {
      const message = (error as EnvValidationError).message;
      expect(message).toContain('DATABASE_URL');
      expect(message).toContain('API_PORT');
      expect(message).toContain('DEFAULT_CURRENCY');
      expect(message).toContain('DEFAULT_TIME_ZONE');
      expect(message).not.toContain('secret-password');
    }
  });

  it('requires the database and Redis URLs', () => {
    expect(() => parseEnv(apiEnvSchema, {})).toThrow(/DATABASE_URL[\s\S]*REDIS_URL/);
  });
});
