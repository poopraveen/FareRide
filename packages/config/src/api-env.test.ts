import { describe, expect, it } from 'vitest';

import { apiEnvSchema } from './api-env.js';
import { EnvValidationError, parseEnv } from './parse-env.js';

const required = {
  MONGODB_URI: 'mongodb://localhost:27017/?replicaSet=rs0&directConnection=true',
  REDIS_URL: 'redis://localhost:6379',
};

describe('apiEnvSchema', () => {
  it('applies development defaults, including regional ones', () => {
    const env = parseEnv(apiEnvSchema, required);

    expect(env).toMatchObject({
      NODE_ENV: 'development',
      API_PORT: 4000,
      CORS_ORIGINS: [],
      MONGODB_DB_NAME: 'fareride',
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
        MONGODB_URI: 'postgres://user:secret-password@host/db',
        MONGODB_DB_NAME: 'gym saas',
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
      expect(message).toContain('MONGODB_URI');
      expect(message).toContain('MONGODB_DB_NAME');
      expect(message).toContain('API_PORT');
      expect(message).toContain('DEFAULT_CURRENCY');
      expect(message).toContain('DEFAULT_TIME_ZONE');
      expect(message).not.toContain('secret-password');
    }
  });

  it('accepts an Atlas SRV connection string', () => {
    const env = parseEnv(apiEnvSchema, {
      ...required,
      MONGODB_URI: 'mongodb+srv://app:pass@cluster0.example.mongodb.net/?retryWrites=true',
    });

    expect(env.MONGODB_URI.startsWith('mongodb+srv://')).toBe(true);
  });

  it('requires the MongoDB and Redis connection strings', () => {
    expect(() => parseEnv(apiEnvSchema, {})).toThrow(/MONGODB_URI[\s\S]*REDIS_URL/);
  });
});
