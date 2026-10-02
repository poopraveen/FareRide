import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { type LivenessReport, type ReadinessReport } from '@fareride/types';

import { ApiException } from '../common/api-exception.filter.js';
import { HealthService } from './health.service.js';

@ApiTags('operations')
@Controller()
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get('health')
  @ApiOperation({ summary: 'Liveness: the process is up. Does not check dependencies.' })
  liveness(): LivenessReport {
    return this.health.liveness();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness: MongoDB and Redis are reachable. 503 otherwise.' })
  async readiness(): Promise<ReadinessReport> {
    const report = await this.health.readiness();
    if (report.status !== 'ready') {
      throw new ApiException(
        'SERVICE_UNAVAILABLE',
        'A required dependency is unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
        { checks: report.checks },
      );
    }
    return report;
  }
}
