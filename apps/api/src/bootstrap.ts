import helmet from '@fastify/helmet';
import { type INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module.js';
import { REQUEST_ID_HEADER, resolveRequestId } from './common/request-id.js';
import { APP_CONFIG, type AppConfig } from './config/app-config.js';

const BODY_LIMIT_BYTES = 1_048_576;

export function createAdapter(): FastifyAdapter {
  return new FastifyAdapter({
    genReqId: resolveRequestId,
    bodyLimit: BODY_LIMIT_BYTES,
    trustProxy: true,
  });
}

/** Applies everything main.ts and the tests share, so tests exercise the real HTTP setup. */
export async function configureApp(app: NestFastifyApplication): Promise<void> {
  const config = app.get<AppConfig>(APP_CONFIG);

  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('v1', { exclude: ['health', 'ready'] });
  app.enableCors({ origin: config.CORS_ORIGINS, credentials: true });
  app.enableShutdownHooks();

  // The API serves JSON only, so helmet's strict default CSP applies in production.
  // Outside production the Swagger UI needs inline assets, so CSP is relaxed there.
  await app.register(
    helmet,
    config.NODE_ENV === 'production' ? {} : { contentSecurityPolicy: false },
  );

  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onSend', async (request, reply) => {
      void reply.header(REQUEST_ID_HEADER, request.id);
    });

  if (config.NODE_ENV !== 'production') {
    setupSwagger(app);
  }
}

function setupSwagger(app: INestApplication): void {
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('FareRide API').setVersion('1').build(),
  );
  SwaggerModule.setup('docs', app, document);
}

export async function createApp(): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, createAdapter(), {
    bufferLogs: true,
  });
  await configureApp(app);
  return app;
}
