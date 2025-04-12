import morgan from 'morgan';
import split from 'split';

import { logger } from '../utils';

const stream = split().on('data', (message: unknown) => logger.http(message));

export const requestLogger = morgan(
    '[server] :method\t:url\t:status\t:res[content-length] bytes\t:response-time ms',
    { stream },
);