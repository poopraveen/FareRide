import { Injectable, Logger, type OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

import { type AppConfig, InjectConfig } from '../config/app-config.js';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  readonly client: Redis;

  constructor(@InjectConfig() config: AppConfig) {
    this.client = new Redis(config.REDIS_URL, {
      // Fail fast instead of queueing commands while Redis is unreachable;
      // callers decide whether to retry.
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    });
    this.client.on('error', (error: Error) => {
      this.logger.warn({ err: error }, 'Redis connection error');
    });
  }

  async ping(): Promise<void> {
    await this.client.ping();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }
}
