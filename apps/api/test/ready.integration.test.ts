import { type NestFastifyApplication } from '@nestjs/platform-fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createTestApp } from './create-test-app.js';

// Runs against real PostgreSQL and Redis (docker compose locally, service containers in CI).
const hasRealDependencies =
  process.env.DATABASE_URL !== undefined && process.env.REDIS_URL !== undefined;

describe.runIf(hasRealDependencies)('readiness against real dependencies', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    app = await createTestApp({ env: { READINESS_TIMEOUT_MS: '2000' } });
  });

  afterAll(async () => {
    await app.close();
  });

  it('reports PostgreSQL and Redis as up once connections are established', async () => {
    // Like an orchestrator, poll: Redis connects asynchronously after boot.
    let response = await app.inject({ method: 'GET', url: '/ready' });
    for (let attempt = 0; attempt < 20 && response.statusCode !== 200; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      response = await app.inject({ method: 'GET', url: '/ready' });
    }

    expect(response.json()).toMatchObject({
      success: true,
      data: { status: 'ready', checks: { postgres: 'up', redis: 'up' } },
    });
  });
});
