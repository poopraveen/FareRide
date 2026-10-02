export type DependencyName = 'mongodb' | 'redis';

export type DependencyStatus = 'up' | 'down';

export interface LivenessReport {
  status: 'ok';
  uptimeSeconds: number;
}

export interface ReadinessReport {
  status: 'ready' | 'not_ready';
  checks: Record<DependencyName, DependencyStatus>;
}
