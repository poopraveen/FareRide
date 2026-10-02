import { Injectable } from '@nestjs/common';
import {
  type DependencyName,
  type DependencyStatus,
  type LivenessReport,
  type ReadinessReport,
} from '@fareride/types';

import { type AppConfig, InjectConfig } from '../config/app-config.js';
import { MongoHealth } from '../database/mongo-health.js';
import { RedisService } from '../redis/redis.service.js';

@Injectable()
export class HealthService {
  constructor(
    private readonly mongo: MongoHealth,
    private readonly redis: RedisService,
    @InjectConfig() private readonly config: AppConfig,
  ) {}

  liveness(): LivenessReport {
    return { status: 'ok', uptimeSeconds: Math.round(process.uptime()) };
  }

  async readiness(): Promise<ReadinessReport> {
    const probes: Record<DependencyName, () => Promise<void>> = {
      mongodb: () => this.mongo.ping(),
      redis: () => this.redis.ping(),
    };

    const entries = await Promise.all(
      Object.entries(probes).map(async ([name, probe]) => [name, await this.check(probe)] as const),
    );
    const checks = Object.fromEntries(entries) as Record<DependencyName, DependencyStatus>;
    const ready = Object.values(checks).every((status) => status === 'up');

    return { status: ready ? 'ready' : 'not_ready', checks };
  }

  private async check(probe: () => Promise<void>): Promise<DependencyStatus> {
    let timer: NodeJS.Timeout | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(new Error('Readiness probe timed out'));
      }, this.config.READINESS_TIMEOUT_MS);
    });
    try {
      await Promise.race([probe(), timeout]);
      return 'up';
    } catch {
      return 'down';
    } finally {
      clearTimeout(timer);
    }
  }
}
