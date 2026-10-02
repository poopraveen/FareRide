import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';

import { ApiExceptionFilter } from './common/api-exception.filter.js';
import { REQUEST_ID_HEADER } from './common/request-id.js';
import { ResponseEnvelopeInterceptor } from './common/response-envelope.interceptor.js';
import { APP_CONFIG, type AppConfig, AppConfigModule } from './config/app-config.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './health/health.module.js';
import { RedisModule } from './redis/redis.module.js';

@Module({
  imports: [
    AppConfigModule,
    LoggerModule.forRootAsync({
      inject: [APP_CONFIG],
      useFactory: (config: AppConfig) => ({
        pinoHttp: {
          level: config.LOG_LEVEL,
          // The request ID was already resolved and written to this header by Fastify's genReqId.
          genReqId: (req) => String(req.headers[REQUEST_ID_HEADER]),
          customProps: (req) => ({ requestId: req.id }),
          redact: {
            paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]'],
            censor: '[redacted]',
          },
          autoLogging: { ignore: (req) => req.url === '/health' || req.url === '/ready' },
          ...(config.NODE_ENV === 'development'
            ? { transport: { target: 'pino-pretty', options: { singleLine: true } } }
            : {}),
        },
      }),
    }),
    DatabaseModule,
    RedisModule,
    HealthModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: ApiExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseEnvelopeInterceptor },
  ],
})
export class AppModule {}
