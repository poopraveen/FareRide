import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { defineConfig } from 'prisma/config';

// Local development reads the repository-root .env; CI and production inject real variables.
const rootEnvFile = resolve(import.meta.dirname, '../../.env');
if (existsSync(rootEnvFile)) {
  process.loadEnvFile(rootEnvFile);
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  // `prisma generate` needs no database, so the URL is optional here; migrate commands require it.
  datasource: process.env.DATABASE_URL === undefined ? {} : { url: process.env.DATABASE_URL },
});
