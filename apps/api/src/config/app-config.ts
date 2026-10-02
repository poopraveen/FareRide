import { Global, Inject, Module } from '@nestjs/common';
import { apiEnvSchema, type ApiEnv, parseEnv } from '@fareride/config';

export const APP_CONFIG = Symbol('APP_CONFIG');

export type AppConfig = Readonly<ApiEnv>;

/** Injects the validated configuration: `constructor(@InjectConfig() config: AppConfig)`. */
export const InjectConfig = (): ParameterDecorator => Inject(APP_CONFIG);

export function loadAppConfig(source: NodeJS.ProcessEnv = process.env): AppConfig {
  return Object.freeze(parseEnv(apiEnvSchema, source));
}

@Global()
@Module({
  providers: [{ provide: APP_CONFIG, useFactory: () => loadAppConfig() }],
  exports: [APP_CONFIG],
})
export class AppConfigModule {}
