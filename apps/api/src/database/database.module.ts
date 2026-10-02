import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { APP_CONFIG, type AppConfig } from '../config/app-config.js';
import { MongoHealth } from './mongo-health.js';

// Global query hardening (docs/SECURITY.md): reject unknown filter fields and
// neutralise query operators smuggled in through user input (e.g. `{ $ne: null }`).
mongoose.set('strictQuery', true);
mongoose.set('sanitizeFilter', true);

const SERVER_SELECTION_TIMEOUT_MS = 5_000;

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [APP_CONFIG],
      useFactory: (config: AppConfig) => ({
        uri: config.MONGODB_URI,
        // Always FareRide's own database, even if the URI names another one (ADR 0009).
        dbName: config.MONGODB_DB_NAME,
        appName: 'fareride-api',
        serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
        // Indexes are applied by a release job in production, never on application boot.
        autoIndex: config.NODE_ENV !== 'production',
      }),
    }),
  ],
  providers: [MongoHealth],
  exports: [MongoHealth],
})
export class DatabaseModule {}
