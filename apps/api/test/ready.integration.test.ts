import { getConnectionToken } from '@nestjs/mongoose';
import { type NestFastifyApplication } from '@nestjs/platform-fastify';
import { type Connection } from 'mongoose';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createTestApp } from './create-test-app.js';

// Runs against a real MongoDB replica set and Redis (docker compose locally, containers in CI).
const hasRealDependencies =
  process.env.MONGODB_URI !== undefined && process.env.REDIS_URL !== undefined;

describe.runIf(hasRealDependencies)('readiness against real dependencies', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    app = await createTestApp({
      env: { READINESS_TIMEOUT_MS: '2000', MONGODB_DB_NAME: 'fareride_test' },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('reports MongoDB and Redis as up once connections are established', async () => {
    // Like an orchestrator, poll: Redis connects asynchronously after boot.
    let response = await app.inject({ method: 'GET', url: '/ready' });
    for (let attempt = 0; attempt < 20 && response.statusCode !== 200; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      response = await app.inject({ method: 'GET', url: '/ready' });
    }

    expect(response.json()).toMatchObject({
      success: true,
      data: { status: 'ready', checks: { mongodb: 'up', redis: 'up' } },
    });
  });

  it('runs multi-document transactions, which wallet and ride updates depend on', async () => {
    const connection = app.get<Connection>(getConnectionToken());
    const collection = connection.collection('transactionProbe');
    await collection.deleteMany({});

    const session = await connection.startSession();
    try {
      await session.withTransaction(async () => {
        await collection.insertOne({ step: 'debit' }, { session });
        await collection.insertOne({ step: 'ledger' }, { session });
      });
    } finally {
      await session.endSession();
    }

    expect(await collection.countDocuments()).toBe(2);
    await collection.drop();
  });

  it('uses the configured FareRide database, not the one named in the URI', () => {
    const connection = app.get<Connection>(getConnectionToken());

    expect(connection.name).toBe('fareride_test');
  });
});
