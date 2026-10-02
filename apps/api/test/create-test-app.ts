import { type NestFastifyApplication } from '@nestjs/platform-fastify';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import { AppModule } from '../src/app.module.js';
import { configureApp, createAdapter } from '../src/bootstrap.js';
import { APP_CONFIG, type AppConfig, loadAppConfig } from '../src/config/app-config.js';
import { MongoHealth } from '../src/database/mongo-health.js';
import { RedisService } from '../src/redis/redis.service.js';

export interface FakeDependency {
  ping: () => Promise<void>;
}

interface TestAppOptions {
  /** Replace real dependencies with fakes; omit to use the real MongoDB and Redis. */
  fakes?: { mongo: FakeDependency; redis: FakeDependency };
  env?: Record<string, string>;
}

export function testConfig(env: Record<string, string> = {}): AppConfig {
  return loadAppConfig({
    NODE_ENV: 'test',
    LOG_LEVEL: 'fatal',
    MONGODB_URI: 'mongodb://localhost:27017/?replicaSet=rs0&directConnection=true',
    MONGODB_DB_NAME: 'fareride_test',
    REDIS_URL: 'redis://localhost:6379',
    READINESS_TIMEOUT_MS: '200',
    ...process.env,
    ...env,
  });
}

export async function createTestApp(options: TestAppOptions = {}): Promise<NestFastifyApplication> {
  let builder = Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(APP_CONFIG)
    .useValue(testConfig({ NODE_ENV: 'test', LOG_LEVEL: 'fatal', ...options.env }));

  if (options.fakes) {
    builder = builder
      // Replace the Mongoose connection itself so no network connection is attempted.
      .overrideProvider(getConnectionToken())
      .useValue({ close: () => Promise.resolve() })
      .overrideProvider(MongoHealth)
      .useValue(options.fakes.mongo)
      .overrideProvider(RedisService)
      .useValue(options.fakes.redis);
  }

  const moduleRef = await builder.compile();
  const app = moduleRef.createNestApplication<NestFastifyApplication>(createAdapter(), {
    logger: false,
  });
  await configureApp(app);
  await app.init();
  await app.getHttpAdapter().getInstance().ready();
  return app;
}
