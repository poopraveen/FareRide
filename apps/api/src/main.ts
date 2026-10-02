import 'reflect-metadata';

import { createApp } from './bootstrap.js';
import { APP_CONFIG, type AppConfig } from './config/app-config.js';

const app = await createApp();
const config = app.get<AppConfig>(APP_CONFIG);
await app.listen(config.API_PORT, config.API_HOST);
