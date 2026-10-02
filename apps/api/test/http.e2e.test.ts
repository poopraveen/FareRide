import {
  type ApiFailure,
  type ApiSuccess,
  type LivenessReport,
  type ReadinessReport,
} from '@fareride/types';
import { type NestFastifyApplication } from '@nestjs/platform-fastify';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { createTestApp, type FakeDependency } from './create-test-app.js';

const healthy = (): FakeDependency => ({ ping: vi.fn(() => Promise.resolve()) });

describe('HTTP foundation (fake dependencies)', () => {
  let app: NestFastifyApplication;
  const mongo = healthy();
  const redis = healthy();

  beforeAll(async () => {
    app = await createTestApp({ fakes: { mongo, redis } });
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health returns liveness in the success envelope', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' });

    expect(response.statusCode).toBe(200);
    expect(response.json<ApiSuccess<LivenessReport>>()).toEqual({
      success: true,
      data: { status: 'ok', uptimeSeconds: expect.any(Number) as number },
      requestId: response.headers['x-request-id'],
    });
  });

  it('GET /ready reports each dependency when all are up', async () => {
    const response = await app.inject({ method: 'GET', url: '/ready' });

    expect(response.statusCode).toBe(200);
    expect(response.json<ApiSuccess<ReadinessReport>>().data).toEqual({
      status: 'ready',
      checks: { mongodb: 'up', redis: 'up' },
    });
  });

  it('GET /ready returns 503 naming the dependency that is down', async () => {
    vi.mocked(redis.ping).mockRejectedValueOnce(new Error('ECONNREFUSED'));

    const response = await app.inject({ method: 'GET', url: '/ready' });

    expect(response.statusCode).toBe(503);
    expect(response.json()).toMatchObject({
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        details: { checks: { mongodb: 'up', redis: 'down' } },
      },
    });
  });

  it('GET /ready treats a hanging dependency as down after the timeout', async () => {
    vi.mocked(mongo.ping).mockImplementationOnce(() => new Promise(() => undefined));

    const response = await app.inject({ method: 'GET', url: '/ready' });

    expect(response.statusCode).toBe(503);
    expect(response.json<ApiFailure>().error.details).toMatchObject({
      checks: { mongodb: 'down' },
    });
  });

  it('echoes a caller-supplied request ID in the header and body', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
      headers: { 'x-request-id': 'client-trace-0001' },
    });

    expect(response.headers['x-request-id']).toBe('client-trace-0001');
    expect(response.json<ApiSuccess<LivenessReport>>().requestId).toBe('client-trace-0001');
  });

  it('returns unknown routes as a NOT_FOUND error envelope', async () => {
    const response = await app.inject({ method: 'GET', url: '/v1/does-not-exist' });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toMatchObject({
      success: false,
      error: { code: 'NOT_FOUND' },
      requestId: response.headers['x-request-id'],
    });
  });

  it('serves versioned routes under /v1 but keeps probes at the root', async () => {
    const versioned = await app.inject({ method: 'GET', url: '/v1/health' });

    expect(versioned.statusCode).toBe(404);
  });

  it('sets security headers', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' });

    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['strict-transport-security']).toBeDefined();
  });
});
