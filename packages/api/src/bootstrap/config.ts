import dotenv from 'dotenv';

import { logger } from '../utils';

logger.info('[config] Load environment variables from .env');
dotenv.config();

if (process.env.NODE_ENV) {
    const path = `.env.${process.env.NODE_ENV.trim()}`;
    logger.info(`[config] Load environment variables from ${path}`);
    dotenv.config({ path: path, override: true });
}
